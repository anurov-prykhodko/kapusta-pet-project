import s from './IncomesOutcomesMonthly.module.css';
import { formatNumber } from '../../utils/formatNumber';
//грн.

const IncomesOutcomesMonthly = ({ incomes, outcomes }) => {
  return (
    <div className={s.balance_container}>
      <div className={s.outcomes_div}>
        <p className={s.title}>Расходы:</p>
        <p className={s.outcomes}>{`- ${formatNumber(outcomes)} грн.`}</p>
      </div>
      <div className={s.incomes_div}>
        <p className={s.title}>Доходы:</p>
        <p className={s.incomes}>{`+ ${formatNumber(incomes)} грн.`}</p>
      </div>
    </div>
  );
};

export { IncomesOutcomesMonthly };