/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIncome } from '../../redux/transactions/transactionsSelectors';
import {
  getExpenseByDate,
  getIncomseByDate,
  changeIncome,
} from '../../redux/transactions/transactionsOperations';
import {
  getAllExpenseCategories,
  addCategory,
  removeCategoryById,
} from '../../redux/categories/categoriesOperations';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import ButtonBasic from '../ButtonBasic/ButtonBasic';
import Icons from '../../Icons';
import s from './ExpInTable.module.scss';
import dateRequest from '../../services/dateRequest';
import { newExpenseData, newIncomeData } from '../../redux/auth/authOperations';

import {
  changeSummaryYear,
  changeCategory,
  // newRefresh,
} from '../../redux/summary/summarySlice';
import {
  // eslint-disable-next-line no-unused-vars
  getSummaryYear,
  getSummaryCategory,
} from '../../redux/summary/summarySelectors';
import { getAllCategories } from '../../redux/categories/categoriesSelectors';
import {
  changeExpenseTransaction,
  changeIncomeTransaction,
} from '../../redux/transactions/transactionsSlice';

registerLocale('ru', ru);

export default function ExpInTable({ children }) {
  const [startDate, setStartDate] = useState(new Date());
  const [request, setRequest] = useState('');
  const [expenses, setExpenses] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [activeBtn, setActiveBtn] = useState(false);

  const utcDate = startDate.setHours(startDate.getHours() + 2);
  const newDate = new Date(utcDate);
  const transactionDate = newDate.toISOString();

  const incomeStatus = useSelector(getIncome);

  const dispatch = useDispatch();

  ////////////////////////////////////////////////////
  const prevCategory = useSelector(getSummaryCategory);

  const expenseCategories = useSelector(getAllCategories);

  function onChangeTime(date) {
    dispatch(changeSummaryYear(date.getFullYear()));
    if (!prevCategory) {
      dispatch(changeCategory('expenses'));
    }
  }

  function onCategoryExpenses() {
    dispatch(changeCategory('expenses'));
    dispatch(changeSummaryYear(startDate.getFullYear()));
  }

  function onCategoryIncomes() {
    dispatch(changeCategory('incomes'));
    dispatch(changeSummaryYear(startDate.getFullYear()));
  }

  // function refreshSummary() {
  //   setInterval(() => {
  //     dispatch(newRefresh());
  //   }, 3000);
  // }
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    dispatch(getAllExpenseCategories());
    dispatch(changeSummaryYear(startDate.getFullYear()));
    // setSearch('pending');
  }, []);

  useEffect(() => {
    dispatch(getExpenseByDate(dateRequest(startDate)));
  }, []);

  const formatInputValue = inputValue => Number(inputValue).toFixed(2);

  const handleNameChange = event => {
    setRequest(event.currentTarget.value);
  };
  const handleNewCategory = event => {
    setNewCategory(event.currentTarget.value);
  };

  const handleNumbChange = event => {
    setExpenses(event.currentTarget.value);
  };

  const changeSelect = event => {
    setCategory(event.currentTarget.value);
  };

  const onClear = event => {
    setExpenses('');
    setRequest('');
    setCategory('');
  };

  const addCatagory = event => {
    setActiveBtn(!activeBtn);
  };

  const addNewCatagory = event => {
    if (newCategory === '') {
      return setActiveBtn(false);
    }
    dispatch(
      addCategory({
        category: newCategory,
        income: false,
        iconName: 'prochee',
      }),
    );
    setActiveBtn(false);
    setNewCategory('');
  };

  const deleteNewCatagory = event => {
    if (newCategory === '') {
      return setActiveBtn(false);
    }
    const curCategory = expenseCategories.find(
      item => item.category === newCategory,
    );
    dispatch(removeCategoryById(curCategory._id));
    setActiveBtn(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (category === '') {
      return;
    }
    if (incomeStatus === true) {
      await dispatch(
        newIncomeData({
          sum: `${formatInputValue(expenses)}`,
          transactionName: `${request}`,
          category: `${category}`,
          income: true,
        }),
      );
      dispatch(
        changeIncomeTransaction({
          sum: `${formatInputValue(expenses)}`,
          transactionName: `${request}`,
          category: `${category}`,
          income: true,
          createdAt: transactionDate,
        }),
      );
      dispatch(getIncomseByDate(dateRequest(startDate)));
      onClear();
      return;
    }
    if (!incomeStatus === true) {
      await dispatch(
        newExpenseData({
          sum: `${formatInputValue(expenses)}`,
          transactionName: `${request}`,
          category: `${category}`,
          income: false,
        }),
      );
      dispatch(
        changeExpenseTransaction({
          sum: `${formatInputValue(expenses)}`,
          transactionName: `${request}`,
          category: `${category}`,
          income: false,
          createdAt: transactionDate,
        }),
      );
      dispatch(getExpenseByDate(dateRequest(startDate)));
      onClear();
      return;
    }
  };

  return (
    <div className={s.exptabs}>
      <section className={s.expinmain}>
        <div className={s.expintab}>
          <button
            style={
              incomeStatus === true ? { color: 'black' } : { color: '#ff751d' }
            }
            className={s.tabtitle}
            onClick={() => {
              dispatch(getExpenseByDate(dateRequest(startDate)));
              dispatch(changeIncome(false));
              onCategoryExpenses();
            }}
          >
            РАСХОД
          </button>
          <button
            style={
              incomeStatus === false ? { color: 'black' } : { color: '#ff751d' }
            }
            className={s.tabtitle}
            onClick={() => {
              dispatch(getIncomseByDate(dateRequest(startDate)));
              dispatch(changeIncome(true));
              onCategoryIncomes();
            }}
          >
            ДОХОД
          </button>
        </div>
        <div className={s.expinboard}>
          <div className={s.expinrail}>
            <div className={s.calendarblock}>
              <label data-for="date">
                <Icons
                  name="calendar"
                  width={20}
                  height={20}
                  className={s.calendaricon}
                />
              </label>
              <DatePicker
                id="date"
                className={s.calendar}
                selected={startDate}
                onChange={date => {
                  setStartDate(date);
                  onChangeTime(date);
                }}
                dateFormat="dd.MM.yyyy"
                locale="ru"
              />
            </div>
            <div className={s.expininput}>
              <input
                value={request}
                onChange={handleNameChange}
                className={s.expinplace}
                type="text"
                placeholder="Описание товара"
              />
              {incomeStatus === false ? (
                <>
                  <select
                    value={category}
                    onChange={changeSelect}
                    className={s.expinplace}
                  >
                    <option value="">Категория товара</option>
                    {expenseCategories.map(item => (
                      <option key={item.category}>{item.category}</option>
                    ))}
                    {/* <option>Транспорт</option>
                  <option>Продукты</option>
                  <option>Здоровье</option>
                  <option>Алкоголь</option>
                  <option>Развлечения</option>
                  <option>Всё для дома</option>
                  <option>Техника</option>
                  <option>Коммуналка, связь</option>
                  <option>Спорт, хобби</option>
                  <option>Образование</option>
                <option>Прочее</option> */}
                  </select>
                  <button
                    type="click"
                    onClick={addCatagory}
                    className={s.btn_plus_category}
                  >
                    {activeBtn ? (
                      <Icons
                        name="minus"
                        width={14}
                        height={14}
                        color={'#52555f'}
                      />
                    ) : (
                      <Icons
                        name="plus"
                        width={14}
                        height={14}
                        color={'#52555f'}
                      />
                    )}
                  </button>
                  {activeBtn && (
                    <div className={s.add_categoty}>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={handleNewCategory}
                        className={s.add_categoty_input}
                        placeholder="Название категории"
                      />
                      <div>
                        <button
                          type="click"
                          onClick={addNewCatagory}
                          className={s.btn_new_category}
                        >
                          Добавить
                        </button>
                        <button
                          type="click"
                          onClick={deleteNewCatagory}
                          className={s.btn_new_category}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <select
                  value={category}
                  onChange={changeSelect}
                  className={s.expinplace}
                >
                  <option value="">Категория дохода</option>
                  <option>ЗП</option>
                  <option>ДОП.ДОХОД</option>
                </select>
              )}
              <input
                value={expenses}
                onChange={handleNumbChange}
                className={s.expinplace}
                type="number"
                placeholder="0"
              />
              <Icons
                name="calculator"
                width={20}
                height={20}
                className={s.iconCalculator}
              />
            </div>
            <div className={s.btnGroup}>
              <ButtonBasic
                type="submit"
                active={true}
                name="enter"
                onClick={handleSubmit}
              >
                Ввод
              </ButtonBasic>
              <ButtonBasic
                type="submit"
                active={false}
                bordered={true}
                name="clean"
                onClick={onClear}
              >
                Очистить
              </ButtonBasic>
            </div>
          </div>
          {/* <HomeTable /> */}
          {children}
        </div>
      </section>
      <section className={s.expinmainmobile}>
        <div className={s.calendarmob}>
          <label data-for="datemob">
            <Icons
              name="calendar"
              width={20}
              height={20}
              className={s.calendaricon}
            />
          </label>
          <DatePicker
            id="datemob"
            className={s.calendar}
            selected={startDate}
            onChange={date => {
              setStartDate(date);
              onChangeTime(date);
            }}
            dateFormat="dd.MM.yyyy"
            locale="ru"
          />
        </div>
        {children}
        {/* <div>Здесь мобильная таблица расходов</div> */}
        {/* <div className={s.expbtnblock}>
          <button className={s.expmobBtn}>Расход</button>
          <button className={s.expmobBtn}>Доход</button>
        </div> */}
      </section>
    </div>
  );
}
