import React, { useEffect, useReducer, useRef, useState } from 'react';
import './Cruds.css';

// Initial State Of useReducer Hook
const initialState = {
  title: '',
  price: 0,
  taxes: 0,
  ads: 0,
  discount: 0,
  total: 0,
  count: 0,
  category: '',
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case 'TITLE':
      return { ...state, title: action.payload };

    case 'PRICE':
      return { ...state, price: action.payload };

    case 'TAXES':
      return { ...state, taxes: action.payload };

    case 'ADS':
      return { ...state, ads: action.payload };

    case 'DISCOUNT':
      return { ...state, discount: action.payload };

    case 'COUNT':
      return { ...state, count: action.payload };

    case 'CATEGORY':
      return { ...state, category: action.payload };

    case 'TOTAL': {
      if (state.price !== 0 && state.taxes !== 0 && state.ads !== 0) {
        let totalprice = +state.price + +state.taxes + +state.ads - +state.discount;
        return { ...state, total: totalprice };
      }
      return { ...state };
    }

    case 'TOTAL_0':
      return { ...state, price: 0, taxes: 0, ads: 0, discount: 0, total: 0 };

    default:
      return state;
  }
};

export const Cruds = () => {
  // Intitialize Variables
  let itemCount = [];

  // For Updating
  const title = document.getElementById('input1');
  const price = document.getElementById('input2');
  const taxes = document.getElementById('input3');
  const ads = document.getElementById('input4');
  const discount = document.getElementById('input5');
  const count = document.getElementById('input6');
  const category = document.getElementById('input7');

  // States & Refs
  const [items, dispatch] = useReducer(reducer, initialState);
  const [list, setList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchState, setSearchState] = useState(false);
  const [update, setUpdate] = useState(false);
  let [temp, setTemp] = useState(null);
  const [search, setSearch] = useState('Title');
  const FormRef = useRef();

  // For Get Data From Local Storage
  useEffect(() => {
    if (localStorage.getItem('list')) {
      setList([...JSON.parse(localStorage.getItem('list'))]);
    }
  }, []);

  // For Changeing The Total By Changing The Value Of price, taxes, ads, discount
  useEffect(() => {
    dispatch({ type: 'TOTAL' });
  }, [items.price, items.taxes, items.ads, items.discount]);

  // Update
  const Update = index => {
    const UpdatedItem = list[index];
    title.value = UpdatedItem.title;
    price.value = UpdatedItem.price;
    taxes.value = UpdatedItem.taxes;
    ads.value = UpdatedItem.ads;
    discount.value = UpdatedItem.discount;
    count.style.display = 'none';
    category.value = UpdatedItem.category;

    setTemp(index);
    setUpdate(true);
  };

  // Creating The List After Clicking On Create
  const eventHandler = () => {
    if (!update) {
      if (items.total) {
        for (let i = 0; i < items.count; i++) {
          itemCount.push(items);
        }

        setList([...list, ...itemCount]);

        // For Saving Data In Local Storage After Create Items
        localStorage.setItem('list', JSON.stringify([...list, ...itemCount]));
      }
    } else {
      const UpdatedList = list.map((item, ind) => {
        if (ind === temp) {
          return {
            title: title.value,
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            total: items.total,
            category: category.value,
          };
        } else return item;
      });

      setList([...UpdatedList]);
      // For Saving Data In Local Storage After Updating
      localStorage.setItem('list', JSON.stringify([...UpdatedList]));

      count.style.display = 'block';
      setUpdate(false);
    }

    FormRef.current.reset();
    dispatch({ type: 'TOTAL_0' });
  };

  // To Remove All Items iN the List
  const clearAll = () => {
    setSearchList([]);

    setList([]);
    // For Saving Data In Local Storage After Clear ALl Items
    localStorage.setItem('list', JSON.stringify([]));
  };

  // For Delete Item From The List
  const deletion = index => {
    list.splice(index, 1);
    setList([...list]);
    // For Saving Data In Local Storage After Create Items
    localStorage.setItem('list', JSON.stringify([...list]));
  };

  // For Searching By Title Of Category
  const searchMethod = e => {
    if (e.target.value) {
      const searchResult = list.filter(item => {
        const { title, category } = item;
        if (search === 'Title') {
          return title.toLowerCase().includes(e.target.value.toLowerCase());
        } else {
          return category.toLowerCase().includes(e.target.value.toLowerCase());
        }
      });
      setSearchList([...searchResult]);

      setSearchState(true);
    } else {
      setSearchState(false);
    }
  };

  // JSX
  return (
    <div className="app-container bg-dark">
      <div className="row w-75 m-auto d-flex justify-content-center">
        <div className="row text-center mb-3">
          <h1 className="text-primary text-uppercase">Cruds System</h1>
        </div>
        {/* Form Of Data Entry */}
        <form onSubmit={e => e.preventDefault()} ref={FormRef}>
          <div className="row">
            <input id="input1" type="text" placeholder="title" onChange={e => dispatch({ type: 'TITLE', payload: e.target.value })} />
          </div>
          <div className="price row calc mt-2">
            <input id="input2" className="col-2" type="text" placeholder="price" onChange={e => dispatch({ type: 'PRICE', payload: e.target.value })} />
            <input id="input3" className="col-2" type="text" placeholder="taxes" onChange={e => dispatch({ type: 'TAXES', payload: e.target.value })} />
            <input id="input4" className="col-2" type="text" placeholder="ads" onChange={e => dispatch({ type: 'ADS', payload: e.target.value })} />
            <input id="input5" className="col-2" type="text" placeholder="discount" onChange={e => dispatch({ type: 'DISCOUNT', payload: e.target.value })} />
            <div className={`total col-2 ${items.total ? 'bg-success' : null}`}>{items.total ? `${items.total}$` : 'Total'}</div>
          </div>
          <div className="row mt-2">
            <input id="input6" type="text" placeholder="count" onChange={e => dispatch({ type: 'COUNT', payload: e.target.value })} />
          </div>
          <div className="row mt-2">
            <input id="input7" type="text" placeholder="category" onChange={e => dispatch({ type: 'CATEGORY', payload: e.target.value })} />
          </div>
          <div className="row mt-2">
            <button className="btn btn-primary" onClick={eventHandler}>
              {update ? 'Update' : 'Create'}
            </button>
          </div>
          <div className="row mt-2">
            <input type="search" placeholder={`Search by ${search}`} onChange={e => searchMethod(e)} />
          </div>
          <div className="row searchby mt-2">
            <div className="btn btn-primary col-5" onClick={() => setSearch('Title')}>
              Search by Title
            </div>
            <div className="btn btn-primary col-5" onClick={() => setSearch('Category')}>
              Search by Category
            </div>
          </div>
          <div className="row mt-2">
            <div className="btn btn-primary" onClick={clearAll}>
              Delete All ({list.length})
            </div>
          </div>
        </form>

        {/* Details OF Each Item */}
        <div className="row results mt-2">
          <h2 className="col-1">id</h2>
          <h2 className="col-2">title</h2>
          <h2 className="col-1">price</h2>
          <h2 className="col-1">taxes</h2>
          <h2 className="col-1">ads</h2>
          <h2 className="col-1">discount</h2>
          <h2 className="col-1">total</h2>
          <h2 className="col-2">category</h2>
          <h2 className="col-1">update</h2>
          <h2 className="col-1">delete</h2>
        </div>
        <hr className="text-primary" />
        {/* Showing The List || The Search List */}
        <div className="row result">
          {searchState
            ? searchList.map((item, index) => {
                const { title, price, taxes, ads, discount, total, category } = item;
                return (
                  <React.Fragment key={index}>
                    <h3 className="col-1">{index + 1}</h3>
                    <h3 className="col-2">{title}</h3>
                    <h3 className="col-1">{price}</h3>
                    <h3 className="col-1">{taxes}</h3>
                    <h3 className="col-1">{ads}</h3>
                    <h3 className="col-1">{discount}</h3>
                    <h3 className="col-1">{total}</h3>
                    <h3 className="col-2">{category}</h3>
                    <h3 className="col-1 btn btn-primary" onClick={() => Update(index)}>
                      UPDATE
                    </h3>
                    <h3 className="col-1 btn btn-primary" onClick={() => deletion(index)}>
                      DELETE
                    </h3>
                    <hr className="text-primary" />
                  </React.Fragment>
                );
              })
            : list.map((item, index) => {
                const { title, price, taxes, ads, discount, total, category } = item;
                return (
                  <React.Fragment key={index}>
                    <h3 className="col-1">{index + 1}</h3>
                    <h3 className="col-2">{title}</h3>
                    <h3 className="col-1">{price}</h3>
                    <h3 className="col-1">{taxes}</h3>
                    <h3 className="col-1">{ads}</h3>
                    <h3 className="col-1">{discount}</h3>
                    <h3 className="col-1">{total}</h3>
                    <h3 className="col-2">{category}</h3>
                    <h3 className="col-1 btn btn-primary" onClick={() => Update(index)}>
                      UPDATE
                    </h3>
                    <h3 className="col-1 btn btn-primary" onClick={() => deletion(index)}>
                      DELETE
                    </h3>
                    <hr className="text-primary" />
                  </React.Fragment>
                );
              })}
        </div>
      </div>
    </div>
  );
};
