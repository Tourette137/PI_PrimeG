import React from 'react'

const Bracket = ({bracket}) => {
    return (
        <div className= "h-full grid place-content-center">
          <div className = "divide-y divide-gray-200 hover:bg-gray-200 w-[300px] md:w-[250px] h-[64px] text-black rounded-lg border-2 border-black">
            {(bracket.nomeEquipa1 != null
              ?
                (<div className="h-[30px] text-left pt-2 pl-4">{bracket.nomeEquipa1}</div>)

              : (<div className="h-[30px]"></div>)
            )
            }
            {(bracket.nomeEquipa2 != null
              ?
                (<div className="h-[30px] text-left pl-4">{bracket.nomeEquipa2}</div>)

              : (<div className="h-[30px]"></div>)
            )
            }
            <br/>
          </div>
        </div>
    )
}

export default Bracket;
