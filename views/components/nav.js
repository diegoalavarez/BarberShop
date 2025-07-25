const navbar = document.querySelector("#navbar");

const createNavHome = ()=> {
    navbar.innerHTML = `
          <div
        class="max-w-7xl h-16 mx-auto flex items-center px-4 justify-between" 
      >
      <img src="/imgs/LogoBarber.png" alt="logo" class="h-14" />


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

         <!--mobile menu-->

             <div class="bg-slate-600/30 fixed top-16 right-0 left-0 bottom-0 justify-center items-center flex-col gap-4 hidden ">
        <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-stone-600 py-2 px-4 rounded-lg">Login</a>
        <a href="/signup/" class="transition ease-in-out text-white font-bold bg-stone-400 hover:bg-stone-600 py-2 px-4 rounded-lg">SignUp</a>
    </div>

      </div>
        `;
};

const createNavSignup = ()=> {
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

         <!--mobile menu-->

             <div class="bg-slate-600/30 fixed top-16 right-0 left-0 bottom-0 justify-center items-center flex-col gap-4 hidden ">
        <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-stone-600 py-2 px-4 rounded-lg">Login</a>
        <a href="/signup/" class="transition ease-in-out text-white font-bold bg-stone-400 hover:bg-stone-600 py-2 px-4 rounded-lg">SignUp</a>
    </div>

      </div>
        `;
};

const createNavLogin = ()=> {
    navbar.innerHTML = `
          <div
        class="max-w-7xl h-26 mx-auto flex items-center px-4 justify-between" 
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

         <!--mobile menu-->

             <div class="bg-slate-600/30 fixed top-16 right-0 left-0 bottom-0 justify-center items-center flex-col gap-4 hidden ">
        <a href="/login/" class="transition ease-in-out text-white font-bold hover:bg-stone-600 py-2 px-4 rounded-lg">Login</a>
        <a href="/signup/" class="transition ease-in-out text-white font-bold bg-stone-400 hover:bg-stone-600 py-2 px-4 rounded-lg">SignUp</a>
    </div>

      </div>
        `;
};

if(window.location.pathname === '/') {
    createNavHome();
}
else if(window.location.pathname === '/login/') {
    createNavLogin();
}

else if(window.location.pathname === '/signup/') {
    createNavSignup();
}

const navBtn = navbar.children[0].children[1];
navBtn.addEventListener('click', ()  => {
    const menuMobile = navbar.children[0].children[3];
    if(!navBtn.classList.contains('active')) {
        navBtn.classList.add('active');
        navBtn.innerHTML = navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />'
        menuMobile.classList.remove('hidden');
        menuMobile.classList.add('flex');
    } else {
        navBtn.classList.remove('active');
        navBtn.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />'
        menuMobile.classList.remove('flex');
        menuMobile.classList.add('hidden');
    }
    

});

