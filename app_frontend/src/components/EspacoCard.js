import React from 'react'

import profileIcon from '../images/espaco.png'

const EspacoCard = ({url,nome,rua,contacto}) => {
    return (
      <div className="w-full place-content-center hover:scale-105 transition duration-500">
        <div className="flex-col mx-auto p-2 shadow-2xl shadow-gray-300 rounded-2xl h-[370px] w-[350px] bg-white text-black text-left">
            <div className="mx-auto w-[320px] h-[250px] bg-transparent">
            {(url == null || url == undefined) ?
                  (<img className="w-[320px] h-[250px] object-contain" src={profileIcon} alt="Espaco Picture"></img>)
              :   (<img className="w-[320px] h-[250px] object-contain" src={url} alt="Espaco Picture2"></img>)
              }
            </div>
            <div className=" w-[320px] h-[100px] mx-auto mt-2 p-2">
                <p className="text-2xl font-bold">{nome}</p>
                  <div class="flex flex-wrap items-center">
                    <div class="w-auto mr-1">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.98667C10.9391 1.92581 9.50028 1.32982 7.99999 1.32982C6.4997 1.32982 5.06086 1.92581 3.99999 2.98667C2.93913 4.04754 2.34314 5.48638 2.34314 6.98667C2.34314 8.48696 2.93913 9.92581 3.99999 10.9867L7.51333 14.5067C7.5753 14.5692 7.64904 14.6188 7.73028 14.6526C7.81152 14.6864 7.89865 14.7039 7.98666 14.7039C8.07467 14.7039 8.1618 14.6864 8.24304 14.6526C8.32428 14.6188 8.39802 14.5692 8.45999 14.5067L12 10.9533C13.0564 9.89689 13.6499 8.46404 13.6499 6.97001C13.6499 5.47597 13.0564 4.04312 12 2.98667ZM11.0467 10L7.99999 13.06L4.95333 10C4.35142 9.39755 3.94164 8.63017 3.77579 7.79487C3.60994 6.95956 3.69545 6.09384 4.02153 5.30713C4.34761 4.52042 4.89961 3.84804 5.60775 3.37499C6.31589 2.90194 7.14838 2.64946 7.99999 2.64946C8.8516 2.64946 9.6841 2.90194 10.3922 3.37499C11.1004 3.84804 11.6524 4.52042 11.9785 5.30713C12.3045 6.09384 12.3901 6.95956 12.2242 7.79487C12.0583 8.63017 11.6486 9.39755 11.0467 10ZM5.99999 4.94001C5.4618 5.47985 5.15959 6.21105 5.15959 6.97334C5.15959 7.73563 5.4618 8.46683 5.99999 9.00667C6.39983 9.4072 6.90905 9.68073 7.46376 9.79294C8.01847 9.90516 8.59396 9.85106 9.11804 9.63744C9.64212 9.42382 10.0914 9.06019 10.4096 8.59217C10.7278 8.12415 10.9007 7.57259 10.9067 7.00667C10.9097 6.62881 10.8369 6.25418 10.6926 5.90493C10.5483 5.55568 10.3355 5.23891 10.0667 4.97334C9.80244 4.70306 9.48738 4.4877 9.13961 4.33965C8.79184 4.1916 8.41822 4.11379 8.04026 4.11069C7.6623 4.10759 7.28746 4.17927 6.93731 4.3216C6.58716 4.46393 6.26861 4.67409 5.99999 4.94001ZM9.12666 8.06001C8.87402 8.3165 8.54013 8.47727 8.18208 8.51484C7.82402 8.55241 7.46404 8.46443 7.16366 8.26596C6.86329 8.06748 6.64119 7.77083 6.53533 7.42673C6.42947 7.08262 6.44643 6.71243 6.5833 6.37944C6.72017 6.04645 6.96846 5.77135 7.28572 5.60116C7.60297 5.43098 7.96949 5.37628 8.32262 5.44642C8.67574 5.51656 8.99353 5.70718 9.22167 5.98569C9.4498 6.26421 9.5741 6.61332 9.57333 6.97334C9.56363 7.38485 9.39099 7.77569 9.09333 8.06001H9.12666Z" fill="#D5DAE1"></path>
                      </svg>
                    </div>
                    <div class="w-auto">
                      <p class="text-xs text-xl text-coolGray-500">{rua}</p>
                    </div>
                  </div>
                <div className="flex mt-1 ml-1">
                  <svg className="mt-1" width="15" height="14" viewbox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.4601 7.66667C12.3134 7.66667 12.1601 7.62 12.0134 7.58667C11.7164 7.52121 11.4245 7.43432 11.1401 7.32666C10.8308 7.21415 10.4908 7.21999 10.1856 7.34307C9.88038 7.46614 9.63146 7.69775 9.48673 7.99333L9.34007 8.29333C8.69074 7.93212 8.09406 7.48349 7.56673 6.96C7.04325 6.43268 6.59461 5.836 6.2334 5.18666L6.5134 5C6.80898 4.85528 7.04059 4.60635 7.16366 4.30113C7.28674 3.9959 7.29258 3.65594 7.18007 3.34666C7.07422 3.06161 6.98736 2.76986 6.92007 2.47333C6.88673 2.32667 6.86007 2.17333 6.84007 2.02C6.75911 1.55041 6.51315 1.12516 6.14648 0.820825C5.77981 0.51649 5.31653 0.353071 4.84007 0.359999H2.84007C2.55275 0.357301 2.26823 0.416541 2.00587 0.533685C1.74351 0.65083 1.50947 0.823129 1.31969 1.03885C1.1299 1.25458 0.988824 1.50866 0.906059 1.78381C0.823295 2.05895 0.800787 2.3487 0.840067 2.63333C1.19523 5.42625 2.47075 8.02125 4.46517 10.0084C6.45958 11.9956 9.05921 13.2617 11.8534 13.6067H12.1067C12.5983 13.6074 13.073 13.427 13.4401 13.1C13.651 12.9114 13.8195 12.6801 13.9344 12.4215C14.0493 12.163 14.108 11.883 14.1067 11.6V9.6C14.0986 9.13692 13.9299 8.69103 13.6296 8.33844C13.3293 7.98585 12.9159 7.74842 12.4601 7.66667ZM12.7934 11.6667C12.7933 11.7613 12.773 11.8549 12.7339 11.9411C12.6948 12.0273 12.6378 12.1042 12.5667 12.1667C12.4925 12.2313 12.4054 12.2796 12.3112 12.3083C12.217 12.337 12.1178 12.3456 12.0201 12.3333C9.52333 12.0132 7.20422 10.871 5.42854 9.08686C3.65286 7.30273 2.52167 4.97822 2.2134 2.48C2.20279 2.38234 2.21209 2.28355 2.24074 2.18959C2.26938 2.09563 2.31678 2.00846 2.38007 1.93333C2.44254 1.86222 2.51944 1.80523 2.60565 1.76614C2.69186 1.72706 2.78541 1.70678 2.88007 1.70667H4.88007C5.0351 1.70322 5.18648 1.75392 5.30816 1.85005C5.42984 1.94617 5.51421 2.08171 5.54673 2.23333C5.5734 2.41555 5.60673 2.59555 5.64673 2.77333C5.72375 3.12476 5.82624 3.47012 5.9534 3.80666L5.02007 4.24C4.94026 4.27661 4.86848 4.32863 4.80884 4.39306C4.7492 4.45749 4.70287 4.53307 4.67251 4.61546C4.64216 4.69785 4.62838 4.78542 4.63197 4.87315C4.63555 4.96087 4.65643 5.04703 4.6934 5.12666C5.65287 7.18183 7.3049 8.83387 9.36007 9.79333C9.52237 9.86001 9.70443 9.86001 9.86673 9.79333C9.94987 9.76359 10.0263 9.71763 10.0915 9.65812C10.1567 9.59861 10.2095 9.52673 10.2467 9.44666L10.6601 8.51333C11.0047 8.63658 11.3565 8.73899 11.7134 8.82C11.8912 8.86 12.0712 8.89333 12.2534 8.92C12.405 8.95252 12.5406 9.03689 12.6367 9.15857C12.7328 9.28025 12.7835 9.43163 12.7801 9.58667L12.7934 11.6667Z" fill="#194BFB"></path>
                  </svg>
                  <span class="ml-3">{contacto}</span>
                </div>
            </div>
        </div>
      </div>
    )
}

export default EspacoCard;
