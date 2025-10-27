
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, incrementByAmount } from "../utils/counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Count: {count}</h2>
      <button
        onClick={() => dispatch(increment())}
        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
      >
        +
      </button>
      <button
        onClick={() => dispatch(decrement())}
        className="bg-red-500 text-white px-3 py-1 rounded mr-2"
      >
        -
      </button>
      <button
        onClick={() => dispatch(incrementByAmount(5))}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        +5
      </button>
    </div>
  );
}

export default Counter;
