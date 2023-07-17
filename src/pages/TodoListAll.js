import React, {  Component } from "react";
import "../pages/TodoListAll.css";
import ShowTodos from "../component/TodoData";

export default class TodoPage extends Component {

     render() { 
      return (
        <div className="Todo List">
          <h1>Todo List </h1>
          <div><ShowTodos/><br></br></div>
        </div>
      );
  }

}

  

