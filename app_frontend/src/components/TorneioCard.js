import React from 'react'

import profileIcon from '../images/torneio.png'

const TorneioCard = ({torneio}) => {
  console.log(torneio)

  const escalao = (torneio.escalao == 0) ? "Seniores" :
                  (torneio.escalao == 1) ? "Sub-21" :
                  (torneio.escalao == 2) ? "Sub-20" :
                  (torneio.escalao == 3) ? "Sub-19" :
                  (torneio.escalao == 4) ? "Sub-18" :
                  (torneio.escalao == 5) ? "Sub-17" :
                  (torneio.escalao == 6) ? "Sub-16" :
                  (torneio.escalao == 7) ? "Sub-15" :
                  (torneio.escalao == 8) ? "Sub-14" :
                  (torneio.escalao == 9) ? "Sub-13" :
                  (torneio.escalao == 10) ? "Sub-12" :
                  (torneio.escalao == 11) ? "Sub-11" :
                  (torneio.escalao == 12) ? "Sub-10" :
                  (torneio.escalao == 13) ? "Sub-9" :
                  (torneio.escalao == 14) ? "Sub-8" :
                  (torneio.escalao == 15) ? "Sub-7" :
                  (torneio.escalao == 16) ? "Sub-6" :
                  "Sub-5"
    return (
      <div className= "w-full mt-4 mb-4 ml-5 mr-5">
        <div className="flex-wrap p-4 md:flex mx-auto hover:bg-gray-200 hover:scale-105 transition duration-500 shadow-2xl shadow-gray-300 rounded-2xl md:h-[200px] md:w-[700px] w-[350px] h-[400px] bg-white">
            <div className="mx-auto w-[170px] h-[170px] bg-transparent">
                {(torneio.imageUrl === null) ?
                  (<img className="w-[170px] h-[170px] object-contain" src={profileIcon} alt="Torneio Picture"></img>)
              :   (<img className="w-[170px] h-[170px] object-contain" src={torneio.imageUrl} alt="Torneio Picture2"></img>)
              }
            </div>
            <div className="w-[320px] md:w-[450px] md:h-[175px] h-[190px]  mt-4 md:mt-1 mx-auto text-left">
                <h1 className="text-4xl font-bold text-center">{torneio.nomeTorneio}</h1>


                <div class="w-auto p-2">
                  <div class="flex flex-wrap items-center">
                    <div class="w-auto mr-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.98667C10.9391 1.92581 9.50028 1.32982 7.99999 1.32982C6.4997 1.32982 5.06086 1.92581 3.99999 2.98667C2.93913 4.04754 2.34314 5.48638 2.34314 6.98667C2.34314 8.48696 2.93913 9.92581 3.99999 10.9867L7.51333 14.5067C7.5753 14.5692 7.64904 14.6188 7.73028 14.6526C7.81152 14.6864 7.89865 14.7039 7.98666 14.7039C8.07467 14.7039 8.1618 14.6864 8.24304 14.6526C8.32428 14.6188 8.39802 14.5692 8.45999 14.5067L12 10.9533C13.0564 9.89689 13.6499 8.46404 13.6499 6.97001C13.6499 5.47597 13.0564 4.04312 12 2.98667ZM11.0467 10L7.99999 13.06L4.95333 10C4.35142 9.39755 3.94164 8.63017 3.77579 7.79487C3.60994 6.95956 3.69545 6.09384 4.02153 5.30713C4.34761 4.52042 4.89961 3.84804 5.60775 3.37499C6.31589 2.90194 7.14838 2.64946 7.99999 2.64946C8.8516 2.64946 9.6841 2.90194 10.3922 3.37499C11.1004 3.84804 11.6524 4.52042 11.9785 5.30713C12.3045 6.09384 12.3901 6.95956 12.2242 7.79487C12.0583 8.63017 11.6486 9.39755 11.0467 10ZM5.99999 4.94001C5.4618 5.47985 5.15959 6.21105 5.15959 6.97334C5.15959 7.73563 5.4618 8.46683 5.99999 9.00667C6.39983 9.4072 6.90905 9.68073 7.46376 9.79294C8.01847 9.90516 8.59396 9.85106 9.11804 9.63744C9.64212 9.42382 10.0914 9.06019 10.4096 8.59217C10.7278 8.12415 10.9007 7.57259 10.9067 7.00667C10.9097 6.62881 10.8369 6.25418 10.6926 5.90493C10.5483 5.55568 10.3355 5.23891 10.0667 4.97334C9.80244 4.70306 9.48738 4.4877 9.13961 4.33965C8.79184 4.1916 8.41822 4.11379 8.04026 4.11069C7.6623 4.10759 7.28746 4.17927 6.93731 4.3216C6.58716 4.46393 6.26861 4.67409 5.99999 4.94001ZM9.12666 8.06001C8.87402 8.3165 8.54013 8.47727 8.18208 8.51484C7.82402 8.55241 7.46404 8.46443 7.16366 8.26596C6.86329 8.06748 6.64119 7.77083 6.53533 7.42673C6.42947 7.08262 6.44643 6.71243 6.5833 6.37944C6.72017 6.04645 6.96846 5.77135 7.28572 5.60116C7.60297 5.43098 7.96949 5.37628 8.32262 5.44642C8.67574 5.51656 8.99353 5.70718 9.22167 5.98569C9.4498 6.26421 9.5741 6.61332 9.57333 6.97334C9.56363 7.38485 9.39099 7.77569 9.09333 8.06001H9.12666Z" fill="#D5DAE1"></path>
                      </svg>
                    </div>
                    <div class="w-auto">
                      <p class="text-xs font-medium text-coolGray-500">{torneio.Nome}</p>
                    </div>
                  </div>
                </div>

                <div class="w-auto p-2">
                  <div class="flex flex-wrap items-center">
                    <div class="w-auto mr-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.33333 1.33333C6.01478 1.33333 4.72585 1.72432 3.62952 2.45686C2.5332 3.18941 1.67871 4.2306 1.17413 5.44877C0.669545 6.66695 0.537523 8.00739 0.794758 9.3006C1.05199 10.5938 1.68693 11.7817 2.61928 12.714C3.55163 13.6464 4.73952 14.2813 6.03272 14.5386C7.32593 14.7958 8.66638 14.6638 9.88455 14.1592C11.1027 13.6546 12.1439 12.8001 12.8765 11.7038C13.609 10.6075 14 9.31854 14 8C14 7.12452 13.8276 6.25761 13.4925 5.44877C13.1575 4.63993 12.6664 3.90501 12.0474 3.28595C11.4283 2.66689 10.6934 2.17583 9.88455 1.8408C9.07571 1.50577 8.20881 1.33333 7.33333 1.33333ZM7.33333 13.3333C6.27849 13.3333 5.24735 13.0205 4.37028 12.4345C3.49322 11.8485 2.80964 11.0155 2.40597 10.041C2.0023 9.06643 1.89668 7.99408 2.10247 6.95951C2.30826 5.92495 2.81621 4.97464 3.56209 4.22876C4.30797 3.48288 5.25828 2.97493 6.29284 2.76914C7.32741 2.56335 8.39977 2.66897 9.3743 3.07264C10.3488 3.47631 11.1818 4.15989 11.7678 5.03695C12.3539 5.91402 12.6667 6.94516 12.6667 8C12.6667 9.41448 12.1048 10.771 11.1046 11.7712C10.1044 12.7714 8.74781 13.3333 7.33333 13.3333ZM7.33333 3.99999C7.15652 3.99999 6.98695 4.07023 6.86192 4.19526C6.7369 4.32028 6.66666 4.48985 6.66666 4.66666V7.61333L5.26666 8.42C5.13823 8.49277 5.03759 8.60611 4.98051 8.74225C4.92344 8.87838 4.91316 9.02961 4.95129 9.17222C4.98942 9.31482 5.0738 9.44074 5.1912 9.53022C5.3086 9.61971 5.45238 9.66769 5.59999 9.66666C5.71678 9.66747 5.83172 9.63758 5.93333 9.58L7.66666 8.58L7.72666 8.51999L7.83333 8.43333C7.85939 8.40033 7.88175 8.36455 7.89999 8.32666C7.92172 8.29087 7.9396 8.25288 7.95333 8.21333C7.97146 8.17094 7.98271 8.12593 7.98666 8.08L7.99999 8V4.66666C7.99999 4.48985 7.92976 4.32028 7.80473 4.19526C7.67971 4.07023 7.51014 3.99999 7.33333 3.99999Z" fill="#D5DAE1"></path>
                      </svg>
                    </div>
                    <div class="w-auto">
                      <p class="text-xs font-medium text-coolGray-500">{torneio.dataTorneio}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-2 mt-2 border-t border-gray-200">
                  <div class="flex flex-wrap items-center">

                    <div class="w-auto p-2">
                      <div class="inline-flex px-2 h-7 items-center justify-center text-orange-100 bg-orange-500 rounded-full">

                        <span class="text-xs font-medium">{escalao}</span>
                      </div>
                    </div>
                    <div class="w-auto p-2">
                      <div class="inline-flex px-2 h-7 items-center justify-center text-blue-100 bg-blue-500 rounded-full">

                        <span class="text-xs font-medium">{torneio.nomeDesporto}</span>
                      </div>
                    </div>
                    <div class="w-auto p-2">
                      <div class="inline-flex px-2 h-7 items-center justify-center text-green-100 bg-green-500 rounded-full">

                        <span class="text-xs font-medium">
                        {torneio.isFederado === 1
                        ? (
                          "Federado"
                          )
                        : "Amador"
                        }
                        </span>
                      </div>
                    </div>
                    <div class="w-auto p-2">
                      <div class="inline-flex px-2 h-7 items-center justify-center text-gray-100 bg-black rounded-full">

                        <span class="text-xs font-medium">
                        {torneio.tamEquipa === 1
                        ? (
                          "Individual"
                          )
                        : "Equipas"
                        }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    )
}

export default TorneioCard;
