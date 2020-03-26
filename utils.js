dfd=$.get("https://raw.githubusercontent.com/fczbkk/css-selector-generator/master/build/index.js")
function Append_To_Head(elemntType, content){
    // if provided content is "link" or "inline codes"

        var x = document.createElement(elemntType);
        if (elemntType=='script')    { x.type='text/javascript';    x.innerHTML = content;  }
        else if (elemntType=='style'){ x.type='text/css';    if (x.styleSheet){ x.styleSheet.cssText=content; } else { x.appendChild(document.createTextNode(content)); }   }
    
    //append in head
    (document.head || document.getElementsByTagName('head')[0]).appendChild(x);
}
Append_To_Head("script", dfd.responseText)

//store element in variable
//cssSelectorGenerator(temp1)