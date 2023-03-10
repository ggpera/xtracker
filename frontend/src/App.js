import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';

const App = () => {
  const expDate = useRef(null);
  const expAmount = useRef(null);
  const expShop = useRef(null);
  const expCategory = useRef(null);

  const [expenses, setExpenses] = useState([]);
  // Fetch data from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND}/api/expenses/`,
        );
        const data = await res.json();
        setExpenses(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchExpenses();
  }, []);

  // Add click handler
  const handleClick = async (event) => {
    event.preventDefault();
    const postData = {
      date: expDate.current.value,
      amount: expAmount.current.value,
      category: expCategory.current.value,
      shop: expShop.current.value,
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/expenses/`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'token-value',
          },
          body: JSON.stringify(postData),
        },
      );
      if (res.status === 201) {
        console.log('Posted successfully');
        const data = await res.json();
        setExpenses([...expenses, data]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/expenses/${id}`,
        {
          method: 'delete',
        },
      );
      if (res.status === 200) {
        console.log('Deleted successfully');
        const remainingExpenses = expenses.filter(
          (expense) => expense.id !== id,
        );
        setExpenses(remainingExpenses);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Format date with local standard
  const formatDate = (date) => {
    const format = new Date(date);
    return format.toLocaleDateString('fi-FI');
  };
  return (
    <div>
      <h1>Expense Tracker</h1>
      <div className='flex-container'>
        <div className='list'>
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                {exp.category}: {exp.shop} {exp.amount}e
                <br />
                {formatDate(exp.date)}
                <br />
                <Button
                  variant='contained'
                  onClick={() => handleDelete(exp.id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className='form'>
          <div className='inputs'>
            <h2>Add expense</h2>
            <input type='text' ref={expCategory} placeholder='Category' />
            <br />
            <input type='text' ref={expShop} placeholder='Shop' />
            <br />
            <input type='number' ref={expAmount} placeholder='Cost' />
            <br />
            <input type='date' ref={expDate} placeholder='dd-mm-yyy' />
            <br />
            <Button variant='contained' onClick={handleClick}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
