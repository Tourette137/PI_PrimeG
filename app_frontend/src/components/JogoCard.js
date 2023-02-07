import React from 'react'

const JogoCard = ({jogo,isGroup,nomeEquipa1,nomeEquipa2}) => {
    const list = (jogo.resultado == null) ? [] : jogo.resultado.split('|');
    let geral = [0,0]
    if (list.length > 1){
      for (var i=0;i < list.length;i++){
        let sp = list[i].split('-');
        if(parseInt(sp[0]) > parseInt(sp[1]))
          geral[0] += 1;
        else {
          geral[1] += 1;
        }
      }
    }
    else if (list.length == 1){
      let sp = list[0].split('-');
      geral = [parseInt(sp[0]),parseInt(sp[1])]
    }

    return (
      <div className= "w-auto my-2 bg-white shadow-2xl shadow-gray-300 hover:bg-gray-200 rounded-xl p-2 text-black">

        <div class="flex flex-wrap">



        {isGroup
          ?
            (<div className="text-center font-bold text-orange-500 w-full mt-4"> Grupo {jogo.numeroGrupo} </div>)
          :
            (<div className="text-center font-bold text-orange-500 w-full mt-4"> {jogo.nomeEtapa} </div>)
        }
        </div>

        <div class="flex flex-wrap mx-auto">
          <div class="flex flex-wrap w-full">
            <div className="font-bold text-2xl text-gray-700 text-center w-1/2 h-min"> {nomeEquipa1}</div>
            {jogo.estado === 0
              ?
                (<div className="font-bold text-2xl w-1/2 h-min text-center"> - </div>)
              :
                (<div className="font-bold text-2xl w-1/2 place-content-center flex flex-wrap h-min text-center">
                  <div className={`w-4 mx-1 h-full font text-center ${(list?.length > 1) ? 'pr-6 border-r-2 border-orange-200' : ''}`}>
                    {geral[0]}
                  </div>
                  {list?.length > 1
                  ? <>{list.map((r) => (
                    <div className="w-4 mx-1 h-full font-light text-center">
                      {r.split('-')[0]}
                    </div>
                  ))}</>
                  : null
                }
                </div>)
            }

            <div className="font-bold text-2xl text-gray-700 w-1/2 h-min text-center"> {nomeEquipa2} </div>
            {jogo.estado === 0
              ?
                (<div className="font-bold text-2xl w-1/2 h-min text-center"> - </div>)
              :
                (<div className="font-bold text-2xl w-1/2 place-content-center flex flex-wrap h-min text-center">
                  <div className={`w-4 mx-1 h-full font text-center ${(list?.length > 1) ? 'pr-6 border-r-2 border-orange-200' : ''}`}>
                    {geral[1]}
                  </div>
                  {list?.length > 1
                  ? <>{list.map((r) => (
                    <div className="w-4 mx-1 h-full font-light text-center">
                      {r.split('-')[1]}
                    </div>
                  ))}</>
                  : null
                }
                </div>)
            }
          </div>




          <div class="w-full mx-auto mt-4">
            <div class="flex flex-wrap place-content-center">
              <div class="w-auto mr-1 ">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                </svg>
              </div>
              <div class="w-auto">
                <p class="text-xs font-medium text-coolGray-500">{jogo.hora.split('T')[1].split('.')[0]}</p>
              </div>
            </div>
          </div>




        </div>

        <div class="pt-2 mt-2 border-t border-gray-200">
          <div class="flex flex-wrap items-center">
            <div class="w-auto p-2">
              <div class="flex items-center p-2 bg-gray-400 rounded-md">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0001 2.33337H3.00008C2.2637 2.33337 1.66675 2.93033 1.66675 3.66671V11.6667C1.66675 12.4031 2.2637 13 3.00008 13H11.0001C11.7365 13 12.3334 12.4031 12.3334 11.6667V3.66671C12.3334 2.93033 11.7365 2.33337 11.0001 2.33337Z" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M9.66675 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M4.3335 1V3.66667" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M1.66675 6.33337H12.3334" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M6.3335 9H7.00016" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M7 9V11" stroke="#3D485B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span class="ml-2 text-xs font-medium text-white">{jogo.hora.split('T')[0]}</span>
              </div>
            </div>

                {(jogo.estado === 0
                  ? (<div class="m-2 p-1 px-2 text-center h-min bg-blue-500 text-white text-xs font-bold w-auto  rounded-full uppercase">Por começar</div>)
                  : (jogo.estado === 1
                      ? (<div class="m-2 p-1 px-2 text-center h-min bg-green-500 text-white text-xs font-bold w-auto  rounded-full uppercase">A decorrer</div>)
                      : (<div class="m-2 p-1 px-2 text-center h-min bg-orange-500 text-white text-xs font-bold w-auto  rounded-full uppercase">Encerrado</div>)
                      ))}

            {isGroup
              ?
                (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                    {`Jornada ${jogo.ronda}`}
                </div>)
              : (<div class="m-2 p-1 px-2 text-center h-min bg-black text-white text-xs font-bold w-auto rounded-full uppercase">
                  {`Jogo ${jogo.ronda}`}
                </div>)
            }

          </div>
        </div>
      </div>
    )
}

export default JogoCard;
