document.getElementById("contactForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    document.getElementById("response").innerText = `Thank you, ${name}! We received your message.`;
    
    document.getElementById("contactForm").reset();
});
