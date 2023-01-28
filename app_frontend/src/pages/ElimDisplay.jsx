import React from 'react'
import Bracket from "../components/Bracket.js";
import {useState,useEffect} from 'react';

const ElimDisplay = ({elim,elimSize}) => {
  const c = (elimSize > 31) ? 6 : ((elimSize > 15) ? 5 : ((elimSize > 7) ? 4 : ((elimSize > 3) ? 3 : ((elimSize > 1) ? 2 : 1))))
    return (
      <>
      <section class="bg-coolGray-50 py-4">
        <div class="container px-4 mx-auto">
          <div class="pt-6 bg-white overflow-hidden border border-coolGray-100 rounded-md shadow-dashboard">
            <h2 class="px-6 mb-4 text-lg text-coolGray-900 font-semibold">Eliminatórias</h2>
            <div class="px-6 overflow-y-auto">
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


                <div className={ `flex flex-wrap rounded-lg bg-white w-full my-4 ml-8`}>
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
                  <div className={`w-1/${c}`}>
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
