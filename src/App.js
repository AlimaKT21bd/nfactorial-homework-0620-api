import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";

import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('73863b4f9d597604b77dd6a116a4291648e72380')

const BACKEND_URL = "https://api.todoist.com/rest/v1/tasks";
const DONE = "https://api.todoist.com/sync/v8/completed/get_all"


function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [comletedItems, setCompletedItems] = useState([]);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios.post(`${BACKEND_URL}`, {
        content: itemToAdd,
        completed : false,
    }, {
        headers: {
          Authorization: "Bearer 73863b4f9d597604b77dd6a116a4291648e72380",
        },
    }).then((response) => {
        setItems([ ...items, response.data])
    })
    setItemToAdd("");
  };



  const toggleItemDone = ({ id, completed }) => {
      axios.post(`${BACKEND_URL}/${id}/close`, {
          completed: !completed
      },{
        headers: {
          Authorization: "Bearer 73863b4f9d597604b77dd6a116a4291648e72380",
        }, 
      }).then((response) => {
        const newItems = items.filter((item) => {
            return id !== item.id
        })
        setItems(newItems)

      })
  };

  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/${id}`,{
        headers: {
          Authorization: "Bearer 73863b4f9d597604b77dd6a116a4291648e72380",
        }, 
      }).then((response) => {
        const newItems = items.filter((item) => {
            return id !== item.id
        })
        setItems(newItems)
      })
      
  };


  useEffect(() => {
    axios.get(`${BACKEND_URL}`, {
      headers: {
        Authorization: "Bearer 73863b4f9d597604b77dd6a116a4291648e72380"
      }
    }).then((response) => {
        setItems(response.data);
    })
  }, [searchValue])



  useEffect(() => {
    axios.get(`${DONE}`, {
        headers: {
          Authorization: "Bearer 73863b4f9d597604b77dd6a116a4291648e72380",
        }, 
      })
      .then((response) => setCompletedItems(response.data.items)
      );
  }, [searchValue])



  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>


      {/* completed */}
      <ul className="list-group todo-list">
      <br></br>  
      <div>
        <h3>Completed Tasks</h3>
        <br></br>
      </div>
        {comletedItems.length > 0 ? (
          comletedItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item ${item.completed ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                >
                  {item.content}
                </span>
              </span>
            </li>
          ))
        ) : (
          <div>go do your tasks, lazy-ass!</div>
        )}
      </ul>
    </div>
  );
}

export default App;
