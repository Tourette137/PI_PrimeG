import React from 'react'

const Bracket = ({bracket}) => {
  console.log(bracket.resultado);
    return (
        <div className= "h-full w-full flex">
          <div className = "hover:bg-gray-200 text-sm sm:text-md font-bold text-black flex flex-wrap my-auto h-[64px] w-2/3 mx-auto  rounded-lg bg-white shadow-md opacity-70 shadow-orange-400">
            {(bracket.nomeEquipa1 != null
              ?
                (<div className="h-[30px] h-min w-2/3 text-left pt-3 px-4">{bracket.nomeEquipa1}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 text-center pt-3">1</div>)
              : (<div className="h-[30px] w-1/3 text-center pt-3">-</div>)
            )}

            {(bracket.nomeEquipa2 != null
              ?
                (<div className="h-[30px] w-2/3 h-min text-left pb-3 px-4">{bracket.nomeEquipa2}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 text-center pb-3">1</div>)
              : (<div className="h-[30px] w-1/3 text-center pb-3">-</div>)
            )}
          </div>
        </div>
    )
}

export default Bracket;
