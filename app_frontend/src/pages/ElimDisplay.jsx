import React from 'react'
import Bracket from "../components/Bracket.js";
import {useState,useEffect} from 'react';

const ElimDisplay = ({elim,elimSize,tipo}) => {
  const [c,setC] = useState(0)
  const [e,setE] = useState("Final")
  const [etapa,setEtapa] = useState(e)
  const [loading,setLoading] = useState(false)

  function handleNext(){
    const n = (etapa == "1/2") ? "Final" :
              (etapa == "1/4") ? "1/2" :
              (etapa == "1/8") ? "1/4" :
              (etapa == "1/16") ? "1/8" :
              (etapa == "1/32") ? "1/16" :
              (etapa == "1/64") ? "1/32" :  etapa
    setEtapa(n)
  }

  function handlePrevious(){
    const n = (etapa == "Final") ? "1/2" :
              (etapa == "1/2" && c > 2) ? "1/4" :
              (etapa == "1/4"  && c > 3) ? "1/8" :
              (etapa == "1/8"  && c > 4) ? "1/16" :
              (etapa == "1/16"  && c > 5) ? "1/32" : etapa
    setEtapa(n)
  }

  function handleEtapas(){
    const col = (elimSize > 31) ? 6 : ((elimSize > 15) ? 5 : ((elimSize > 7) ? 4 : ((elimSize > 3) ? 3 : ((elimSize > 1) ? 2 : 1))))
    const e = (col == 1) ? "Final" : (col == 2) ? "1/2" : (col == 3) ? "1/4" : (col == 4) ? "1/8" : (col == 5) ? "1/16" : (col == 6) ? "1/32" : "1/64"
    setC(col)
    setE(e)
    setLoading(false)
  }

  useEffect(() => {
      setLoading(true)
      handleEtapas()
  },[])

  if (loading)
    return (<div>LOADING!!!</div>)

    return (
      <>
      <section class={`bg-coolGray-50 py-4 ${(tipo == 1) ? 'md:hidden' : ''}`}>
        <div class="container px-4 mx-auto">
          <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
            <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Eliminatórias</h2>
            <div class="px-6 overflow-y-auto">
            <section class="py-3">
              <div class="container px-4 mx-auto">
                <div class="p-4 bg-gray-100">
                  <div class="flex flex-wrap items-center justify-between -m-2">
                    <div class={`w-auto p-2 ` }>
                      <a class={`inline-flex group ${(etapa == e) ? '' : 'cursor-pointer'} items-center text-sm font-semibold`} onClick={() => handlePrevious()}>
                        <span class={`${(etapa == e) ? 'text-gray-100 group-hover:text-gray-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
                          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.33294 4.33338H2.27294L4.47294 2.14004C4.59847 2.01451 4.669 1.84424 4.669 1.66671C4.669 1.48917 4.59847 1.31891 4.47294 1.19338C4.3474 1.06784 4.17714 0.997314 3.99961 0.997314C3.82207 0.997314 3.65181 1.06784 3.52627 1.19338L0.192939 4.52671C0.132245 4.59011 0.0846683 4.66487 0.0529387 4.74671C-0.01374 4.90902 -0.01374 5.09107 0.0529387 5.25338C0.0846683 5.33521 0.132245 5.40997 0.192939 5.47338L3.52627 8.80671C3.58825 8.86919 3.66198 8.91879 3.74322 8.95264C3.82446 8.98648 3.9116 9.00391 3.99961 9.00391C4.08761 9.00391 4.17475 8.98648 4.25599 8.95264C4.33723 8.91879 4.41096 8.86919 4.47294 8.80671C4.53542 8.74473 4.58502 8.671 4.61887 8.58976C4.65271 8.50852 4.67014 8.42138 4.67014 8.33337C4.67014 8.24537 4.65271 8.15823 4.61887 8.07699C4.58502 7.99575 4.53542 7.92202 4.47294 7.86004L2.27294 5.66671H7.33294C7.50975 5.66671 7.67932 5.59647 7.80434 5.47145C7.92937 5.34642 7.99961 5.17685 7.99961 5.00004C7.99961 4.82323 7.92937 4.65366 7.80434 4.52864C7.67932 4.40361 7.50975 4.33338 7.33294 4.33338Z" fill="currentColor"></path>
                          </svg>
                        </span>
                        <span class={`ml-2 ${(etapa == e) ? 'text-gray-100 group-hover:text-gray-100' : 'text-orange-500 group-hover:text-gray-200'}`}>Previous</span>
                      </a>
                    </div>
                    <div class="w-auto p-2">
                      <div class="flex items-center">
                        <a class="inline-block px-4 text-sm font-semibold text-gray-500">{etapa}</a>
                      </div>
                    </div>
                    <div class="w-auto p-2">
                      <a class={`inline-flex group ${(etapa == 'Final') ? '' : 'cursor-pointer'} items-center text-sm font-semibold`} onClick={() => handleNext()}>
                        <span class={`mr-2 ${(etapa == 'Final') ? 'text-gray-100 group-hover:text-gray-100' : 'text-orange-500 group-hover:text-gray-200'}`}>Next</span>
                        <span class={`${(etapa == 'Final') ? 'text-gray-100 group-hover:text-gray-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
                          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.667061 5.66663L5.72706 5.66662L3.52706 7.85996C3.40152 7.98549 3.331 8.15576 3.331 8.33329C3.331 8.51083 3.40152 8.68109 3.52706 8.80662C3.6526 8.93216 3.82286 9.00269 4.00039 9.00269C4.17793 9.00269 4.34819 8.93216 4.47373 8.80662L7.80706 5.47329C7.86775 5.40989 7.91533 5.33513 7.94706 5.25329C8.01374 5.09098 8.01374 4.90893 7.94706 4.74662C7.91533 4.66479 7.86775 4.59003 7.80706 4.52662L4.47373 1.19329C4.41175 1.13081 4.33802 1.08121 4.25678 1.04736C4.17554 1.01352 4.0884 0.996093 4.00039 0.996093C3.91239 0.996093 3.82525 1.01352 3.74401 1.04736C3.66277 1.08121 3.58904 1.13081 3.52706 1.19329C3.46457 1.25527 3.41498 1.329 3.38113 1.41024C3.34729 1.49148 3.32986 1.57862 3.32986 1.66663C3.32986 1.75463 3.34729 1.84177 3.38113 1.92301C3.41498 2.00425 3.46457 2.07798 3.52706 2.13996L5.72706 4.33329L0.667061 4.33329C0.49025 4.33329 0.32068 4.40353 0.195656 4.52855C0.0706316 4.65358 0.000394456 4.82315 0.000394471 4.99996C0.000394487 5.17677 0.0706317 5.34634 0.195656 5.47136C0.32068 5.59639 0.49025 5.66663 0.667061 5.66663Z" fill="currentColor"></path>
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              </section>
              <div className={ `rounded-lg bg-white w-full my-4 mx-auto`}>
                  <div className={ `w-full`}>
                    {elim.map((bracket) => (
                      ( bracket.nomeEtapa === etapa
                      ? (<div className="my-4"><Bracket bracket = {bracket}/></div>)
                      : (null)
                      )))
                    }
                  </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section class={`bg-coolGray-50 md:py-4 invisible  ${(tipo == 1) ? 'md:visible' : ''}`}>
        <div class="container px-4 mx-auto">
          <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
            <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Eliminatórias</h2>

            <div class="md:px-6 md:overflow-y-auto">
              <table class="w-full">
                <tbody>
                  <tr class="whitespace-nowrap h-11 bg-gray-100 bg-opacity-80">
                    { elimSize > 31
                    ? (
                      <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">1/32</th>
                      )
                      : (null)
                    }
                    { elimSize > 15
                    ? (
                      <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">1/16</th>
                      )
                      : (null)
                    }
                    { elimSize > 7
                    ? (
                      <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">Oitavos</th>
                      )
                      : (null)
                    }
                    { elimSize > 3
                    ? (
                      <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">Quartos</th>
                      )
                      : (null)
                    }
                    { elimSize > 1
                    ? (
                      <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">Meia-Final</th>
                      )
                      : (null)
                    }
                    <th class="whitespace-nowrap px-4 font-semibold text-xs text-orange-500 uppercase text-center">Final</th>
                    </tr>
                    <tr class="h-18 border-b border-coolGray-100">
                    </tr></tbody></table>


                <div className={ `hidden md:flex md:flex-wrap md:rounded-lg md:bg-white md:w-full md:my-4 md:ml-6`}>
                  { elimSize > 31
                  ? (
                    <div className={ `grid grid-rows-32 w-1/${c}`}>
                      {elim.map((bracket) => (
                        ( bracket.nomeEtapa === "1/32"
                        ? (<Bracket bracket = {bracket}/>)
                        : (null)
                        )))
                      }
                    </div>
                    )
                    : (null)
                  }
                  { elimSize > 15
                  ? (
                    <div className={ `grid grid-rows-16 w-1/${c}`}>
                      {elim.map((bracket) => (
                        ( bracket.nomeEtapa === "1/16"
                        ? (<Bracket bracket = {bracket}/>)
                        : (null)
                        )))
                      }
                    </div>
                    )
                    : (null)
                  }
                  { elimSize > 7
                  ? (
                    <div className={ `grid grid-rows-8 w-1/${c}`}>
                      {elim.map((bracket) => (
                        ( bracket.nomeEtapa === "1/8"
                        ? (<Bracket bracket = {bracket}/>)
                        : (null)
                        )))
                      }
                    </div>
                    )
                    : (null)
                  }
                  { elimSize > 3
                  ? (
                    <div className={ `grid grid-rows-4 w-1/${c}`}>
                      {elim.map((bracket) => (
                        ( bracket.nomeEtapa === "1/4"
                        ? (<Bracket bracket = {bracket}/>)
                        : (null)
                        )))
                      }
                    </div>
                    )
                    : (null)
                  }
                  { elimSize > 1
                  ? (
                    <div className={ `grid grid-rows-2 w-1/${c}`}>
                        {elim.map((bracket) => (
                          ( bracket.nomeEtapa === "1/2"
                          ? (<Bracket bracket = {bracket}/>)
                          : (null)
                          )))
                        }
                    </div>
                    )
                    : (null)
                  }
                  <div className={`${(c > 1) ? `w-1/${c}` : 'w-full'}`}>
                    {elim.map((bracket) => (
                      ( bracket.nomeEtapa === "Final"
                      ? (<Bracket bracket = {bracket} />)
                      : (null)
                      )))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
}

export default ElimDisplay;
