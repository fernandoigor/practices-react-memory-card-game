import { useState } from 'react'
import './App.css'

import NameList from './NameList';


interface cardInterface{
  value: string;
  show: boolean;
  success?: boolean;
}
interface cardClickedInterface{
  row: number;
  col: number;
}



function shuffleArray(array:[string]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  const [size, setSize] = useState(4);
  const [memory, setMemory] = useState<[cardInterface[]]>([
    [{
      value: 'MemoryCard',
      show: false
    },
    {
      value: 'MemoryCard',
      show: false
    }]
  ]);
  const [cardClicked, setCardClicked] = useState<cardClickedInterface | null >(null);
  const [clickable, setClickable] = useState(true);
  

  function handleReset(){
    let list = shuffleArray(NameList).slice(0,size);
    list = shuffleArray([...list, ...list]);

    let mem = [];
    let increment = 0;
    for(let col =0; col<Math.sqrt(list.length); col++){
      mem[col] = [];
      for(let row =0; row<Math.sqrt(list.length); row++){
        if(list[increment]){
          mem[col][row] = {
            value: list[increment++],
            show: false,
            success: false
          }
        }
      }
    }
  
    setMemory(mem);
  }

  function handleChangeSize(event){
    setSize(event.target.value);
  }

  function checkWinner(){
    const youWon = memory.flat().every((reg) => reg && reg.success);
    if(youWon){
      setTimeout(()=>alert('Você Venceu!!!'));
    }
  }

  function handleClickCard(row:number, col:number){
    if(memory !== null){
      if(!memory[row][col].success){
        let mem = [...memory];

        if(cardClicked == null){
          setCardClicked((prev) => ({row, col}));
          mem = mem.map((prev) => (
            prev.map((reg)=>{
              if(reg.success)
                reg.show = true;
              else reg.show = false;
              return reg;
            })
          ))
        }
        else if(memory[cardClicked.row][cardClicked.col].value == memory[row][col].value){
            mem[cardClicked.row][cardClicked.col].success = true;
            mem[row][col].success = true;

            checkWinner();
            setCardClicked(null);
        }else{
          setCardClicked(null);
        }

        mem[row][col].show = true;
        setMemory(mem);
      }
    }
  }

  return (
    <div className="game">
      {
        memory.map((row, rowId)=>{
          return <div className='row' key={rowId}>
            {row.map((el, colId)=>{
            return (
            <div
            className={`card ${el.success ? 'sucess' : ''}`}
            key={`${colId}`}
            onClick={()=>handleClickCard(rowId, colId)}
            >
              { el.show || el.success ? el.value : ''}
            </div>
            );
          })}
          </div>
        })
      }
      <button onClick={handleReset}>Resetar</button>
      Numero de cartões: <input  onChange={handleChangeSize}></input>
    </div>
  )
}

export default App
