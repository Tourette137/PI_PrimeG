import React from 'react'
import logotipo from '../images/logotipo.png'
import {Link} from 'react-router-dom';
import './NavbarDynamic.css'

export function Footer() {
  return (
    <footer className='distanciaBottom'>
    <section class="bg-gray-900 text-white mt-8">
      <div class="container px-4 mx-auto">
      <div class="pt-24 pb-11 mx-auto max-w-4xl">
        <a class="block md:mx-auto mb-5 max-w-max" href="#">

            <img className="w-[160px] h-[40px]" src={logotipo} alt="MATCHUP"></img>
        </a>
        <div class="flex flex-wrap justify-center -mx-3 lg:-mx-6">
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="/#product">Product</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="#">Features</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="/#pricing">Pricing</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="#">Resources</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="#">Careers</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="#">Help</a></div>
          <div class="w-full md:w-auto p-3 md:px-6"><a class="inline-block text-lg md:text-xl text-coolGray-500 hover:text-coolGray-600 font-medium" href="#">Privacy</a></div>
        </div>
      </div>
      </div>
      <div class="border-b border-coolGray-100"></div>
      <div class="container px-4 mx-auto">
      <p class="py-10 md:pb-20 text-lg md:text-xl text-coolGray-400 font-medium text-center">© 2023 MatchUp</p>
      </div>
      </section>
      </footer>
        )
}
