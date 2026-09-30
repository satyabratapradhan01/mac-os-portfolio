import React, { useState } from 'react';
import { sound } from '../../utils/sound';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    sound.playClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    sound.playClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    sound.playClick();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    sound.playClick();
    setDisplay(String(parseFloat(display) * -1));
  };

  const percentage = () => {
    sound.playClick();
    setDisplay(String(parseFloat(display) / 100));
  };

  const performOperation = (nextOp: string) => {
    sound.playClick();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '−':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEquals = () => {
    sound.playClick();
    if (!operation || prevValue === null) return;
    const inputValue = parseFloat(display);
    let result = prevValue;

    switch (operation) {
      case '+':
        result = prevValue + inputValue;
        break;
      case '−':
        result = prevValue - inputValue;
        break;
      case '×':
        result = prevValue * inputValue;
        break;
      case '÷':
        result = inputValue !== 0 ? prevValue / inputValue : 0;
        break;
      default:
        break;
    }

    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  return (
    <div id="calculator-app" className="flex flex-col h-full bg-[#202020] text-white select-none p-3 font-sans justify-between">
      {/* Display */}
      <div className="bg-black/40 rounded-xl p-4 text-right mb-3 flex items-end justify-end overflow-hidden border border-white/5 h-24">
        <span className="text-4xl font-light tracking-tight font-mono truncate">
          {display}
        </span>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {/* Row 1 */}
        <button onClick={clear} className="rounded-xl bg-[#505050] hover:bg-[#606060] active:brightness-75 font-medium text-sm flex items-center justify-center transition-all">
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button onClick={toggleSign} className="rounded-xl bg-[#505050] hover:bg-[#606060] active:brightness-75 font-medium text-sm flex items-center justify-center transition-all">
          ±
        </button>
        <button onClick={percentage} className="rounded-xl bg-[#505050] hover:bg-[#606060] active:brightness-75 font-medium text-sm flex items-center justify-center transition-all">
          %
        </button>
        <button onClick={() => performOperation('÷')} className={`rounded-xl ${operation === '÷' ? 'bg-white text-orange-500' : 'bg-[#FF9F0A] hover:bg-[#ffb034] text-white'} font-medium text-lg flex items-center justify-center transition-all`}>
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => inputDigit('7')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          7
        </button>
        <button onClick={() => inputDigit('8')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          8
        </button>
        <button onClick={() => inputDigit('9')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          9
        </button>
        <button onClick={() => performOperation('×')} className={`rounded-xl ${operation === '×' ? 'bg-white text-orange-500' : 'bg-[#FF9F0A] hover:bg-[#ffb034] text-white'} font-medium text-lg flex items-center justify-center transition-all`}>
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => inputDigit('4')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          4
        </button>
        <button onClick={() => inputDigit('5')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          5
        </button>
        <button onClick={() => inputDigit('6')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          6
        </button>
        <button onClick={() => performOperation('−')} className={`rounded-xl ${operation === '−' ? 'bg-white text-orange-500' : 'bg-[#FF9F0A] hover:bg-[#ffb034] text-white'} font-medium text-lg flex items-center justify-center transition-all`}>
          −
        </button>

        {/* Row 4 */}
        <button onClick={() => inputDigit('1')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          1
        </button>
        <button onClick={() => inputDigit('2')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          2
        </button>
        <button onClick={() => inputDigit('3')} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          3
        </button>
        <button onClick={() => performOperation('+')} className={`rounded-xl ${operation === '+' ? 'bg-white text-orange-500' : 'bg-[#FF9F0A] hover:bg-[#ffb034] text-white'} font-medium text-lg flex items-center justify-center transition-all`}>
          +
        </button>

        {/* Row 5 */}
        <button onClick={() => inputDigit('0')} className="col-span-2 rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-start pl-6 transition-all">
          0
        </button>
        <button onClick={inputDot} className="rounded-xl bg-[#333333] hover:bg-[#444444] active:brightness-75 font-medium text-base flex items-center justify-center transition-all">
          .
        </button>
        <button onClick={handleEquals} className="rounded-xl bg-[#FF9F0A] hover:bg-[#ffb034] active:brightness-75 font-medium text-lg flex items-center justify-center transition-all">
          =
        </button>
      </div>
    </div>
  );
};
