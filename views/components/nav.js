const navbar = document.querySelector("#navbar");

const createNavHome = ()=> {
    navbar.innerHTML = `
          <div
        class="max-w-7xl h-16 mx-auto flex items-center px-4 justify-between" 
      >
      <img src="/imgs/LogoBarber.png" alt="logo" class="h-16" />


        <!-- version mobile -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 md:hidden text-white cursor-pointer p-0.25 hover:bg-stone-600 rounded-lg"
          
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        <!-- version desktop -->
         <div class="hidden md:flex flex-row gap-4">
            <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-stone-600 py-2 px-4 rounded-lg">Login</a>
            <a href="/signup/" class="transition ease-in-out text-white font-bold bg-stone-400 hover:bg-stone-600 py-2 px-4 rounded-lg">SignUp</a>
         </div>


      </div>
        `;
};


createNavHome();
