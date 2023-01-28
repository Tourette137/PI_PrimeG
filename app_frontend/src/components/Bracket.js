import React from 'react'

const Bracket = ({bracket}) => {
  console.log(bracket.resultado);
    return (
        <div className= "h-full w-full flex">
          <div className = "hover:bg-gray-200 font-bold text-gray-700 flex flex-wrap my-auto h-[64px] w-2/3 mx-auto  rounded-lg bg-white shadow-lg shadow-orange-400">
            {(bracket.nomeEquipa1 != null
              ?
                (<div className="h-[30px] w-2/3 text-left pt-2 px-4">{bracket.nomeEquipa1}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 text-center pt-2">1</div>)
              : (<div className="h-[30px] w-1/3 text-center pt-2">-</div>)
            )}

            {(bracket.nomeEquipa2 != null
              ?
                (<div className="h-[30px] w-2/3 text-left px-4">{bracket.nomeEquipa2}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 text-center">1</div>)
              : (<div className="h-[30px] w-1/3 text-center">-</div>)
            )}
          </div>
        </div>
    )
}

export default Bracket;
