import {NavbarDynamic} from '../components/NavbarDynamic.js';
import {Pricing} from '../components/Pricing.js';
import logo from '../images/fans.png';
import {useEffect} from 'react';


export function Home() {
  
  // Use Effect inicial
  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  return(
        <>
            <NavbarDynamic/>
            <section class="relative bg-white overflow-hidden min-h-screen">

              <div class="my-auto place-content-center mt-12">
                <div class="container px-4 mx-auto">
                  <div class="flex flex-wrap xl:items-center -mx-4">
                    <div class="w-full md:w-1/2 px-4 mb-16 md:mb-0">
                      <span class="inline-block py-px px-2 mb-4 text-xs leading-5 text-white bg-orange-500 uppercase rounded-9xl" contenteditable="false">Sports</span>
                      <h1 class="mb-6 text-3xl md:text-5xl lg:text-6xl leading-tight font-bold tracking-tight" contenteditable="false">A way to make your tournaments come to life
                      </h1>
                      <p class="mb-8 text-lg md:text-xl text-coolGray-500 font-medium">Plan your next tournment in record time with matchUp</p>
                      <div class="flex flex-wrap">
                        <div class="w-full md:w-auto py-1 md:py-0 md:mr-4"><a class="inline-block py-5 px-7 w-full text-base md:text-lg leading-4 text-orange-50 font-medium text-center bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 border border-orange-500 rounded-md shadow-sm" href="#">Create a free tournment</a></div>
                        <div class="w-full md:w-auto py-1 md:py-0"><a class="inline-block py-5 px-7 w-full text-base md:text-lg leading-4 text-coolGray-800 font-medium text-center bg-white hover:bg-coolGray-100 focus:ring-2 focus:ring-coolGray-200 focus:ring-opacity-50 border border-coolGray-200 rounded-md shadow-sm" href="login">Sign Up</a></div>
                      </div>
                    </div>
                    <div class="w-full md:w-1/2 px-4">
                      <div class="relative mx-auto md:mr-0 max-w-max">
                        <img class="relative rounded-7xl" src={logo} alt="Logo"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <section id="product" class="py-24 overflow-hidden min-h-screen">
              <div class="container px-4 mx-auto">
                <div class="flex flex-wrap -mx-4">
                  <div class="w-full md:w-1/2 px-4 mb-60 md:mb-0">
                    <div class="relative mx-auto md:ml-0 max-w-max">

                      <img class="absolute z-10 -left-10 -bottom-60 scale-75 w-auto" src="https://static.shuffle.dev/uploads/files/6b/6be8f99c3aa4587acfe9ee848c225f88b273b802/Captura-de-ecra-2023-01-31-as-16-59-40.png" alt=""/>
                      <img class="scale-75 md:w-auto w-auto" src="https://static.shuffle.dev/uploads/files/6b/6be8f99c3aa4587acfe9ee848c225f88b273b802/Captura-de-ecra-2023-01-31-as-16-46-56.png" alt=""/>
                    </div>
                  </div>
                  <div class="w-full md:w-1/2 px-4">
                    <span class="inline-block py-px px-2 mb-4 text-xs leading-5 text-orange-500 bg-orange-100 font-medium uppercase rounded-full shadow-sm">How it works</span>
                    <h2 class="mb-12 text-4xl md:text-5xl leading-tight font-bold tracking-tighter">Planeia e gere o teu torneio em 4 passos </h2>
                    <div class="flex flex-wrap -mx-4 text-center md:text-left">
                      <div class="w-full md:w-1/2 px-4 mb-8">
                        <div class="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white font-semibold rounded-full bg-orange-500">1</div>
                        <h3 class="mb-2 text-xl font-bold">Gestão de inscrições</h3>
                        <p class="font-medium text-coolGray-500">Cria um torneio e gere os pedidos de inscrição de forma simples e eficaz.</p>
                      </div>
                      <div class="w-full md:w-1/2 px-4 mb-8">
                        <div class="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-orange-500 font-semibold rounded-full">2</div>
                        <h3 class="mb-2 text-xl font-bold">Criação de calendario e jogos</h3>
                        <p class="font-medium text-coolGray-500">Após fechar fechar as inscrições é hora de gerar o calendário e os jogos através das ferramentas de geração automática que a MatchUp disponibiliza.</p>
                      </div>
                      <div class="w-full md:w-1/2 px-4 mb-8">
                        <div class="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-orange-500 font-semibold rounded-full">3</div>
                        <h3 class="mb-2 text-xl font-bold">Gerar sorteio</h3>
                        <p class="font-medium text-coolGray-500">Explora os algoritmos de sorteio que disponibilizamos e gera novos sorteios até encontrares o sorteio ideal.</p>
                      </div>
                      <div class="w-full md:w-1/2 px-4">
                        <div class="inline-flex items-center justify-center mb-4 w-12 h-12 text-xl text-white bg-orange-500 font-semibold rounded-full">4</div>
                        <h3 class="mb-2 text-xl font-bold">Atualizar resultados</h3>
                        <p class="font-medium text-coolGray-500">Mantém os participantes e interessados e atualizados, atualiza os resultados dos jogos enquanto o torneio decorre.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <Pricing/>
        </>
    )
}
