import React from 'react'
import {useState,useEffect} from 'react';

const Bracket = ({bracket}) => {
  const [geral,setGeral] = useState([]);
  const [sets,setSets] = useState([]);
  const [loading,setLoading] = useState(false);

  const results = async () => {
    let setsList = []
    let geral2 = [0,0]
    let sp = bracket.resultado.split('|')

    if(sp.length == 1){
      setGeral([sp[0].split('-')[0],sp[0].split('-')[1]])
    }
    else {
      for (var i=0; i < sp.length; i++) {
          var sp2 = sp[i].split('-');
          setsList = setsList.concat({res1:sp2[0],res2:sp2[1]})
          geral2[0] += (sp2[0] > sp2[1]) ? 1 : 0
          geral2[1] += (sp2[0] < sp2[1]) ? 1 : 0
      }
      setGeral(geral2)
      setSets(setsList)
    }

    setLoading(false)
  }

  useEffect(() => {
    if(bracket.resultado != null) {
      results();
      setLoading(true)
    }
  },[])


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
                    {geral[0]}
                  </div>
                  {sets.map((r,index) => (
                    <div className="w-2 mx-1 h-full font-light text-center">
                      {sets[index].res1}
                    </div>
                  ))}
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
                    {geral[1]}
                  </div>
                  {sets.map((r,index) => (
                    <div className="w-2 mx-1 h-full font-light text-center">
                      {sets[index].res2}
                    </div>
                  ))}
                </div>)
              : (<div className="h-[30px] w-1/3 text-center pb-3">-</div>)
            )}
          </div>
        </div>
    )
}

export default Bracket;
