async function autologin(){
  	const req = {
		user: localStorage.getItem("username"),
		pass: localStorage.getItem("password")
	}
	const res = await fetch("/autologin", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req)
	})
	if(res.status==200)
		console.log("Logged in as "+req.user)
	else console.log("Not logged")
}autologin()

document.getElementById("loginform").addEventListener("submit", async function(e){
    e.preventDefault()
    const obj = {
        user: document.getElementById("username").value,
        pass: document.getElementById("password").value,
    }
    console.log(obj)
    const res = await fetch("/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })
	let ress = await res.json()
    if(res.status==200){
        let audio = new Audio("audio_login.mp3");
        audio.play();
        localStorage.setItem("username", ress.user);
        localStorage.setItem("password", ress.pass);
        document.getElementById("loginwindow").style.display = "none";
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          	})
          	Toast.fire({
            	icon: 'success',
            	title: 'Signed in successfully as '+ress.fname+" "+ress.lname
			  })
		return
	}
    alert(ress.res)
})