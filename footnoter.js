//FOOTNOTER
//
// David Weinberger
// May 15, 2009
// updated: Dec. 26, 2015: added markdown
// Feel free to use this pathetic code any way you want
//
// Pulls delimited text out of html and inserts footnotes
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

function footnoteIt(){
	// One big function to do all the heavy lifting
	
	
	
	var delim0e = document.getElementById("delim0txt");
	var delim1e = document.getElementById("delim1txt");
	var delim0 = delim0e.value;
	var delim1 = delim1e.value;
	var source = document.getElementById("sourcetxt").value;
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
	
	
	//--- remove spaces
	if (document.getElementById("removespaceschk").checked){
		var encoded = RegExp.escape(delim0);
		var reg = new RegExp("\\s" + encoded, "g");
		var tempdelim = delim0;
		source = source.replace(reg, tempdelim);
		
	}
	
	// -- clear the decks
	document.getElementById("destintxt").value="";
	document.getElementById("footnotetxt").value="";
	document.getElementById("wysidiv").innerHTML="";
	document.getElementById("status").innerHTML="";
	document.getElementById("statusdiv").style.display="none";
	
	// -- get css prefs
	var csscheckel = document.getElementById('csscheck');
	var includecss = csscheckel.checked; // include css?
	var includeonlycss = false;
	if ((document.getElementById("cssonlycheckspan").style.display=='block') && (document.getElementById("csscheckonly").checked)){
		includeonlycss=true;
	}
	// css class markers
	var bodymarkerclass = document.getElementById("bodymarkerclasstxt").value;
	var fnnumberclass = document.getElementById("fnnumberclasstxt").value;
	var fnnoteclass = document.getElementById("fnnoteclasstxt").value;
	
	// ---- do it		
	var done = false;
	var p0 = -1;
	var p1 = -1;
	var ptr=0;
	var s = "";
	var news = "";
	var footnote="";
	var footnotemarker="";
	var footnotestartnumber = $("#startnumbertxt").val();
	if (footnotestartnumber == 0) footnotestartnumber = 1;
	var footnotectr = 1;
	// is starting number a number?
	var fncheck = parseInt(footnotestartnumber);
	if ((isNaN(footnotestartnumber)) || (footnotestartnumber < 0 )){
		alert("Starting footnote number needs to be a positive integer.");
		return
	}
	footnotestartnumber = fncheck; // convert to int
	
	footnotestartnumber = findHighestFootnote(footnotestartnumber);
	
	var lengthoflongestnote = 0;
	var footnotes = new Array();
	while (!done) {
		p0 = source.indexOf(delim0, ptr);
		if (p0 > -1) { // got an opening delimiter
			// get the closer
			p1 = source.indexOf(delim1, p0);
			if (p1 == -1) { // there was no close
				ptr = p0 + delim0.length; // advance the pointer
			}
			else { // we have an open and a close
				footnote = source.substring(p0 + delim0.length, p1);
				footnotes.push(footnote);
				// check length
				if (footnote.length > lengthoflongestnote) {
					lengthoflongestnote = footnote.length;
					longestnote = footnotes.length  - 1;
				}
				
				var whichmode = $("input[name=mode]:checked").val();
				// markdown
				if (whichmode == "MARKDOWN"){
					footnotemarker = "[^fn" + (footnotectr + footnotestartnumber - 1) + "]"; 
				}
				
				if (whichmode == "HTML"){
				// create marker for in the body of the text
				if ((includecss==true) && (includeonlycss == true)){
					footnotemarker = "<span class='" + bodymarkerclass + "'><a name='fn"  + (footnotectr + footnotestartnumber - 1) + "'><a href=#fnend" + (footnotectr + footnotestartnumber - 1) + ">" + (footnotectr + footnotestartnumber - 1) + "</a></span>";
				}
				if ((includecss==true) && (includeonlycss == false)){
					footnotemarker = "<span class='" + bodymarkerclass + "'><a name='fn"  + (footnotectr + footnotestartnumber - 1) + "'><a href=#fnend" + (footnotectr + footnotestartnumber - 1) + "><sup>" + (footnotectr + footnotestartnumber - 1)+ "</sup></a></span>";
				}
				if (includecss == false) {
					footnotemarker = "<sup><a name='fn" + "'><a href=#fnend" + (footnotectr + footnotestartnumber - 1) + ">" + (footnotectr + footnotestartnumber - 1) + "</a></sup>";
				}
				}
				//s = substituteString(source, footnotemarker, p0, p1 + delim1.length);
				s = s + source.substring(ptr,p0) + footnotemarker;
				footnotectr++; // increment footnote number
				ptr = p1 + delim1.length; // increment the pointer
			}
			
		} // if p0
		else { // no more delim0
			done = true;
			// insert the remainder after the last footnote
			s= s + source.substring(ptr,source.length);
		}
		
	}
	
	// ---- error check: any delimiters?
	if (footnotectr == 1){
		alert("No footnotes marked as " + delim0 +"..." + delim1 + ".");
		return
	}
	
	// display the text with the footnotes removed
	document.getElementById("destintxt").value = s;
	
	// ---- create footnotes
	var fnbox = document.getElementById("footnotetxt");
	fnbox.value = "";
	if (footnotes.length > 0) {
		// create the footnote number preface and then the footnote body
		for (var i=0; i < footnotes.length; i++){
		
			if (whichmode == "MARKDOWN"){
				footnote = "[^fn" + (i + footnotestartnumber) + "]:" + footnotes[i] + "\n\n";
			}	
			if (whichmode == "HTML"){
			if ((includecss == true) && (includeonlycss == true)) {
				footnote = "<p><span class='" + fnnumberclass + "'><a name='fnend" + (i + footnotestartnumber) + "' href='#fn" + (footnotestartnumber + i) + "'>" + (footnotestartnumber + i) + "</a></span>";
				footnote = footnote + "<span class='fnnoteclass" + "'>" + footnotes[i] + "</span></p>";
			}
			if ((includecss == true) && (includeonlycss == false)) {
				footnote = "<p><span class='" + fnnumberclass + "'><sup><a name='fnend" + (i + footnotestartnumber) + "' href='#fn" + (i + footnotestartnumber) + "'>" + (i + 1) + "</a></sup></span>";
				footnote = footnote + "<span class='fnnoteclass" + "'>" + footnotes[i] + "</span></p>";
			}
			if (includecss == false) {
				footnote = "<p><sup><a name='fnend" + ((i + footnotestartnumber)) +  "' href='#fn" + (i + footnotestartnumber) + "'>" + (i + footnotestartnumber) + "</a></sup>";
				footnote = footnote + footnotes[i] + "\n\n";
			}
			}
			
			// add the footnote to the textarea display
			fnbox.value = fnbox.value + footnote;
			
		}
	}
	
	// ---- update status
	var snippet = "";
	if (footnotes.length > 0) {
		snippet = footnotes[longestnote];
		snippet = snippet.substr(0,30) + "...";
	}
	var stat=""
	longestnote = longestnote + footnotestartnumber ; // take it from zero-based
	stat = "Number of footnotes: " + (footnotectr  - 1);
	stat = stat + "<br><em>Note: Lengths include HTML markup</em>";
	stat = stat + "<br>Longest footnote: #" + longestnote + " (" + add_commas(lengthoflongestnote) + " characters)";
	if (snippet != "") {
		stat = stat + "<br>&nbsp;&nbsp;&nbsp;#" + longestnote + " begins:<span style='font-size:10pt;'><em>"+ snippet + "</em></span>";
	}
	stat = stat + "<br>Length of source text: " + add_commas(source.length);
	stat = stat + "<br>Source without footnotes: " + add_commas(document.getElementById("destintxt").value.length);
	stat = stat + "<br>Total length of footnotes: " + add_commas(document.getElementById("footnotetxt").value.length);
	stat = stat + "</p>";
	document.getElementById("status").innerHTML=stat;
	
	// ---- reveal the results in textareas
	document.getElementById("destintxtdiv").style.display="block";
	document.getElementById("footnotetxtdiv").style.display="block";
	document.getElementById("statusdiv").style.display="block";
	
	
	// --- show wysi view
	if (whichmode == "HTML"){
	var wysi = document.getElementById("wysidiv");
	$(wysi).show();
	wysi.innerHTML = "<p class='pclass'><b>WYSIWYG DISPLAY OF RESULTS for proofing</b></p><p>" + s + "<p><hr width='100px' align='center'></p>" + fnbox.value;
	}
	else {
		$(wysi).hide(200);
	}

	
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
  
function findHighestFootnote(forcedStartNumber){
	// go through text finding highest fn
	var sourcetxt = $("#sourcetxt").val();
	var prev=0, p0, p1, c, lastfound=0;
	var highest = forcedStartNumber;
	var done = false;
	// are there any existing footnotes?
	p0= sourcetxt.indexOf("fn");
	if (p0 == -1){
		return highest;
	}
	while (done == false){
		p0= sourcetxt.indexOf("fn",prev);
		if (p0 > -1){
			// get rest until not a number
			var ddone = false;
			var j = 0;
			var numb = "";
			while (ddone == false){
				c = sourcetxt.substr((p0 + 2 + j),1);
				// is c a number?
				if ("012345689".indexOf(c) > -1){
					numb = numb + c;
					j++;
				}
				else {
					ddone = true;
					var intnumb = parseInt(numb);
					if (intnumb > highest){
						highest = intnumb;
					}
				}
			}
		p0 = p0 + 2;
		prev = p0;
		}
	else { // no more matches
		done = true;
		highest = hightest + 1;
		}
	}
	
	return highest
		
}
		
  


