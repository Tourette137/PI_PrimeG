import React from 'react'
import {useState,useEffect} from 'react';

const Bracket = ({bracket}) => {
    return (
        <div className= "h-full w-full flex">
          <div className = "hover:bg-gray-200 text-sm sm:text-md font-bold text-black flex flex-wrap my-auto h-[64px] w-2/3 mx-auto  rounded-lg bg-white shadow-md opacity-70 shadow-orange-400">
            {(bracket.nomeEquipa1 != null
              ?
                (<div className="h-[30px] w-2/3 text-left pt-3 px-4">{bracket.nomeEquipa1}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 flex flex-wrap place-content-center pt-3">
                  <div className="w-3 h-full mr-2 text-center">
                    {bracket.resultado.geral[0][0]}
                  </div>
                  {(bracket.resultado.geral?.length == 2
                    ? ( <div className="w-3 h-full mr-2 text-center">
                        {bracket.resultado.geral[1][0]}
                        </div>
                      )
                    : (bracket.resultado.sets.map((r,index) => (
                      <div className="w-2 mx-1 h-full font-light text-center">
                        {bracket.resultado.sets[index].res1}
                      </div>
                    )))
                  )}
                </div>)
              : (<div className="h-[30px] w-1/3 text-center pt-3">-</div>)
            )}

            {(bracket.nomeEquipa2 != null
              ?
                (<div className="h-[30px] w-2/3 text-left pb-3 px-4">{bracket.nomeEquipa2}</div>)

              : (<div className="h-[30px] w-2/3"></div>)
            )
            }
            {(bracket.resultado != null
              ? (<div className="h-[30px] w-1/3 flex flex-wrap place-content-center pb-3">
                  <div className="w-3 h-full mr-2 text-center">
                    {bracket.resultado.geral[0][1]}
                  </div>
                  {(bracket.resultado.geral?.length == 2
                    ? ( <div className="w-3 h-full mr-2 text-center">
                        {bracket.resultado.geral[1][1]}
                        </div>
                      )
                    : (bracket.resultado.sets.map((r,index) => (
                      <div className="w-2 mx-1 h-full font-light text-center">
                        {bracket.resultado.sets[index].res2}
                      </div>
                    )))
                  )}
                </div>)
              : (<div className="h-[30px] w-1/3 text-center pb-3">-</div>)
            )}
          </div>
        </div>
    )
}

export default Bracket;
