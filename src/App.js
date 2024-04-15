import { useEffect, useState } from 'react';
import { collection, doc, deleteDoc, getDoc, addDoc, getDocs } from 'firebase/firestore';
import './App.css';
import { db } from './firebaseConfig';
import Swal from 'sweetalert';
function App() {

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var today = new Date();
  let month = months[today.getMonth()];
  let dd = String(today.getDate()).padStart(2, '0');
  let year = today.getFullYear();
  let day = days[today.getDay()];
  let d = day + " " + dd + " " + month + " " + year;
  let ampm = today.getHours() >= 12 ? "PM" : "AM";

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime((today.getHours() % 12 || 12).toString().padStart(2, '0') + ":" + (today.getMinutes()).toString().padStart(2, '0') + ":" + (today.getSeconds()).toString().padStart(2, '0') + " " + ampm)
  })

  useEffect(() => {
    getPosts();
  }, [])

  const postCollectionRef = collection(db, "tasks");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = {
      date: d,
      time,
      task
    }
    setTask('');
    await addDoc(postCollectionRef, form);
    console.log("Doc added");
    getPosts();
  }



  const handleRemove = async (id) => {
    let deleteVal = false;
    Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          Swal("Poof! Your imaginary file has been deleted!", {
            icon: "success",
          }
          );
          deteleData(id)
        } else {
          Swal("Your imaginary file is safe!");
          deleteVal = false
        }

      });
  }

  const deteleData = async (id) => {
    const postDoc = doc(db, "tasks", id);
    console.log("Removed");
    getPosts();
    await deleteDoc(postDoc);
  }

  const getPosts = async () => {
    console.log("Reading");
    const data = await getDocs(postCollectionRef);
    let list = [];

    function compare(a, b) {
      if ((a.data().time.includes("AM") && b.data().time.includes("AM")) || (a.data().time.includes("PM") && b.data().time.includes("PM"))) {
        if ((a.data().time.startsWith("12") && (b.data().time.startsWith("12")) || (!a.data().time.startsWith("12") && (!b.data().time.startsWith("12"))))) {
          if (a.data().time < b.data().time) {
            return -1;
          }
          if (a.data().time > b.data().time) {
            return 1;
          }
          return 0;
        }
        else if (a.data().time.startsWith("12")) {
          return -1;
        }
        else {
          return 1;
        }
      }
      else {
        if (a.data().time.includes("AM")) {
          return -1;
        }
        else {
          return 1;
        }
      }
    }
    const x = data.docs;
    x.sort(compare);

    x.map((i) => {
      let words = i.data().date.split(" ");
      // console.log(words);
      list.push(
        <li>
          <div className='container-fluid timing'>
            <p>
              <div className='fw-bold d-inline-block '>{words[1] + " " + words[2] + " " + words[3]} {i.data().time} <div className='d-inline-block ml-3 trash'>
                <i className='fa fa-solid fa-trash' onClick={() => { handleRemove(i.id) }}></i>
              </div>
                :&nbsp;&nbsp;&nbsp;&nbsp; </div>{i.data().task}

            </p>
          </div>
        </li>
      )
    });
    setTasks(
      <>
        {list}
      </>
    )
  }

  return (
    <><div class="body">
      <div className='navbar title-wrap'>
        <div className='container-fluid '>
          <a href="." className='navbar-brand title'><img src="./d.png" alt="logo" /></a>
        </div>
        <div class="titleSeparator"></div>
      </div>
      <div className='container '>
        <div className='today'>
          <div className="date fw-bolder date">{d}</div>
          <div className='conatiner '>
            <ul>
              {tasks}
              <li className='timing'>
                <div className='row'>
                  <div className='col-xxlg-2'>
                    <div className='timeinput'>
                      <p className='text-uppercase fw-ligth'>
                        {time}
                      </p>
                    </div>
                  </div>
                  <div className='col--xxlg-10'>
                    <div className='taskinput'>
                      <form onSubmit={handleSubmit}>
                        <div className='inppt form-floating mb-3'>
                          <input onChange={(e) => { setTask(e.target.value) }} type="text" name="task" className="inpt form-control" autoCapitalize='off' autoComplete='off' value={task} required />
                          <label htmlFor='floatingInput'>Write your own thoughts</label>
                        </div>
                        <div class="sub">
                          <button className='btn btn-primary '>Submit</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
