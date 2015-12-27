//FOOTNOTER
//
// David Weinberger
// June 15, 2009
// Feel free to use this pathetic code any way you want
//
// Re-inserts footnotes removed with footnoter.html back into the text of the document
//


 // define a method for escaping a regular expression
 // Thank you, Mark Wubben http://simonwillison.net/2006/Jan/20/escape/
 RegExp.escape = (function() {
  var specials = [
    '/', '.', '*', '+', '?', '|',
    '(', ')', '[', ']', '{', '}', '\\'
  ];

  sRE = new RegExp(
    '(\\' + specials.join('|\\') + ')', 'g'
  );
  
  return function(text) {
    return text.replace(sRE, '\\$1');
  }
})();

function deFootnoteIt(){
	// One big function to do all the heavy lifting
	
	var delim0e = document.getElementById("delim0txt");
	var delim1e = document.getElementById("delim1txt");
	var delim0 = delim0e.value;
	var delim1 = delim1e.value;
	var source = document.getElementById("sourcetxt").value;
	var destination = document.getElementById("destintxt");
	var longestnote = -1;
	
	// -- error check: bad delimiters
	
	if ((delim0=="") || (delim1=="")) { // blanks
		alert("Enter the characters that make the beginning and the end of footnotes");
		return
	}
		if (delim0==delim1) { // the same
		alert("The charactes that mark the beginning of a foonote must be diferent than the ones that mark the end.");
		return
	}
	
	
	
	// -- clear the decks
	document.getElementById("destintxt").value="";
	document.getElementById("wysidiv").innerHTML="";
	document.getElementById("status").innerHTML="";
	document.getElementById("statusdiv").style.display="none";
	
	
	
	// ---- do it		
	
	// -- First pass: find the footnotes
	var fns = new Array();
	
	var done =false;
	var p =0;
	var ctr = 0;
	var p2;
	var fn = ""; 
	var tempstr= new String;
	while (done == false) {
		fn = "";
		p = source.indexOf("href=#fn", ctr);
		if (p == -1) {
			done = true;
		}
		else {
			// check if it's #fn1 or #fnend. We want just #fn1
			tempstr = source.substr(p + 8,1);
			//alert(tempstr + ":" + "e");
			if (tempstr != "e") {
				// get the beginning of the footnote
				ctr = p;
				p = source.indexOf("</sup>", ctr);
				p = p + 7;
				ctr = p;
				// get the end
				p2 = source.indexOf("<p>", ctr);
				
				if (p2 == -1) { // if last footnote
					p2 = source.length;
				}
				ctr = p2;
				fn = source.substring(p - 1, p2);
				fn = formatFn(fn);
				fns.push(fn);
			}
			else {ctr = p + 5;}
		}
	}
	      
		  
	   // --- SECOND PASS go through source, sticking in the footnotes
	   ctr = 0;
	   var i = 0;
	   done = false;
	   var footnotetext="";
	   var news = "";
	   while (done == false) {
	      p = source.indexOf("href=#fnend", ctr);
	      if (p == -1) {
	         done = true;
	         }
	         else {
			 	p = source.indexOf("<a name=", ctr); // get <a name> before the href we just searched for
	         	news = news + source.substring(ctr, p);
				footnotetext = trimSpacesAndLfs(fns[i]);
	         	news = news + delim0 + footnotetext + delim1;
			 	i++;
	         	// go past the end of the footnote marker
	        	 ctr = p + 1;
	         	p2 = source.indexOf("</sup>", ctr);
	         	if (p2 == -1) {
			 		ctr = source.length;
				 }
			 	else {
			 		ctr = p2 + 6; // go to end of </sup>
				 }
	           
	   }
		
	}
	
  // remove the /n/n </p> at the end of footno
  	  //  var encoded = RegExp.escape(delim0);
	//	var encoded2 = RegExp.escape("\r\r</p>");
	//	var reg = new RegExp(encoded2 + encoded, "g");
	//	var tempdelim = delim1;
	//	source = source.replace(reg, tempdelim);
	
	destination.value = news;
	
	// select that text
	selectAll();
	
	// ---- update status
	
	
	stat = "Number of footnotes: " + fns.length;
	
}

function formatFn(s){
	// get rid of unwanted fluff
	 s = trimSpacesAndLfs(s);
	 
	 // get rid of double linefeed before final </p>
	 var p = s.lastIndexOf("</p>");
	 if (( p == s.length - 4)){
	 	s = s.substring(0, p - 1); // trim off the </p>
	 	s = trimSpacesAndLfs(s);
	 }
	 return s
}

function selectAll(){
	var e =document.getElementById("destintxt");
	e.select();
}

function trimSpacesAndLfs(w){
	if ((w=="") || (w==null) || (w.length == null)){ // skip if empty or not a string
		return w;
	}
    var i = 0;
    var c = "";
    dunn = false;
    var ww = w;
	// remove /n/n</p>
	
    while ((ww.charAt(0) == " " || ww.charAt(0) == "\r" || ww.charAt(0) == "\n") && ww != "") {
        ww = ww.substring(1, ww.length);
    }
    while ((ww.charAt(ww.length - 1) == " " || ww.charAt(ww.length - 1) == "\r" || ww.charAt(ww.length - 1) == "\n") && ww.length > 0) {
        ww = ww.substring(0, ww.length - 1);
    }
    return ww;
}

function substituteString(str,str_insert, a,b){
	// removes from char a to b in string str
	var sa= str.substr(0,a);
	var sb =str.substr(b,str.length);
	
	var news=sa + str_insert +  sb;
	return news;
	
}

function insertSampleMarker(){
	var el = document.getElementById("samplemarker"); // where to put the sample
	var h0 = document.getElementById("html0txt").value; // left side markup
	var h1 = document.getElementById("html1txt").value; // right side
	var s = "&nbsp;sample text" + h0 + "1" + h1 + ".&nbsp;"
	el.innerHTML = s;
	return
}

function showItAll(){
	document.getElementById('everything').style.display='block';
}

function clearItAll(){
	document.getElementById("destintxt").value="";
	document.getElementById("footnotetxt").value="";
	document.getElementById("sourcetxt").value="";
	document.getElementById("wysidiv").innerHTML="";
	document.getElementById("status").innerHTML="";
	document.getElementById("statusdiv").style.display="none";
}

function add_commas(nStr) {
	// Thank you http://www.mredkj.com/javascript/nfbasic.html
       nStr += '';
      x = nStr.split('.');
       x1 = x[0];
       x2 = x.length > 1 ? '.' + x[1] : '';
       var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
  }
  


