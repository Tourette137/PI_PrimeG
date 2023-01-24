import React from 'react'

const EspacoCard = ({nome,rua,contacto}) => {
    return (
      <div className="w-full place-content-center">
        <div className="flex-col mx-auto p-2 shadow-2xl shadow-gray-300 rounded-2xl h-[370px] w-[350px] bg-white text-black text-left">
            <div className="mx-auto w-[320px] h-[250px] bg-black">
                <img
                  src={"../images/logotipo.png"}
                  className=""
                />
            </div>
            <div className=" w-[320px] h-[100px] mx-auto mt-2 p-2">
                <p className="text-2xl font-bold">{nome}</p>
                <p className="text-xl">{rua}</p>
                <p className="text-base">{contacto}</p>
            </div>
        </div>
      </div>
    )
}

export default EspacoCard;
