
function validate(){
   //Зчитуємо значення у змінні x и y
   var x=document.forms['form1']['name'].value;
   var y=document.forms['form1']['email'].value;
   
   if (x.length==0){
	   alert ( "Будь ласка, заповніть поле Імя" )
      document.getElementById('name');
      return false;
   }
   if (y.length==0){
	    alert ( "Будь ласка, заповніть поле Емаіл" )
      document.getElementById('email');
      return false;
   }
   
   at=y.indexOf("@");
   dot=y.indexOf(".");
   if (at<1 || dot <1){
      document.getElementById('email');
	  alert ( "Невірний формат заповнення емаіл, *@" )
      return false;
   }
}
/*
function validate() {
  var nm=document.forms['form1']['name'].value;
  var em=document.forms['form1']['email'].value;
  var em_pattern=/[0-9a-z_]+@[0-9a-z_]+\.[a-z]{2,5}/i;
  var nm_pattern=/[a-z]+/i;
  var prov=em_pattern.test(em);
  var prov1=nm_pattern.test(nm);
  if (prov==true &&  prov1==true) {
        alert("Ви зареєстровані!");
		document.getElementById('name');
		document.getElementById('email');
		
  }
  else {
        alert("Неправильно!");
		document.getElementById('name');
		document.getElementById('email');
  }
}
*/