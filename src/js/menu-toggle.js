

	const menuToggle = document.querySelector('#menu-toggle');
	const bodyEl = document.body;
	function openMobileMenu() {
		menuToggle.classList.add('active');
		bodyEl.classList.add('lock');
	}
	function closeMobileMenu() {
		menuToggle.classList.remove('active');
		bodyEl.classList.remove('lock');
	}
	menuToggle.addEventListener('click', ()=>{
		if(menuToggle.classList.contains('active')){
			closeMobileMenu();
		}else{
			openMobileMenu();
		}
	})
