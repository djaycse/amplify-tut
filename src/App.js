import logo from "./logo.svg";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import React, { useState, useEffect } from "react";
import "./App.css";
import { listTodos } from "./graphql/queries";
// import { createTodo, updateTodo, deleteTodo } from "./graphql/mutations";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";

Amplify.configure(awsconfig);

const initialFormState = { name: "", description: "" };

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql(graphqlOperation(listTodos));
    setNotes(apiData.data.listTodos.items);
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    // await API.graphql(graphqlOperation(createTodo, { input: formData }));
    await API.graphql({
      query: createTodoMutation,
      variables: { input: formData },
    });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Coming soon...</h2>

        {/* Leave a note:
        <input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
          value={formData.name}
        />
        <input
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Your note"
          value={formData.description}
        />
        <button onClick={createTodo}>Add</button>
        <br />
        <div style={{ marginBottom: 30 }}>
          <table border="1" width="100%">
            <tr>
              <th>Name</th>
              <th>Note</th>
              <th></th>
            </tr>
            {notes.map((note) => (
              <tr key={note.id || note.name}>
                <td>{note.name}</td>
                <td>{note.description}</td>
                <td>
                  <button onClick={() => deleteTodo(note)}>Delete note</button>
                </td>
              </tr>
            ))}
          </table>
        </div> */}
      </header>
    </div>
  );
}

export default App;
