FOOTNOTER

Footnotes is a primitive tool for turning inline comments into endnotes.  It produces output in either HTML or Markdown format.

For example, if you have written:

>This is the text that I'm writing.[[This is a footnote]] Here is some more text[[and another footnote]] purely for purposes of example.

You would paste this into the Footnoter.html form and click the button. If you've chosen HTML, the text inside the double brackets will be replaced with a numbered, superscripted footnote, and the footnote text will be put in a separate box on the form. Or if you chose Markdown, the endnotes will be in markdown format, using automatically generated labels.

There are a number of options, including your choice of delimiters, adding CSS class names, etc.  You can choose which number your endnotes should start with, or it will automatically find the highest numbered existing endnote and start from there; this last feature means you can run Footnoter on the same text as you add notes to it.

I wrote this in 2009 and it is poorly constructed. In 2015, I added markdown support (because that's what I use), and added a little jQuery. 

If it's not obvious (and it is), I am a complete amateur. I hope you get some use out of this. It's licensed under  an MIT open license so improve it any way you want.

David Weinberger
Dec. 26, 2015

