/**
 * @author fishbar
 */
(function(Lite){
if(window.DOMParser){ 
         Lite.XML = { 
                 XMLDom:function(ns,root){
		 	if(!ns)ns = '';
			if(!root) root = '';
                        return document.implementation.createDocument(ns,root,null); 
                 }, 
                 load:function(url,async,cb){ 
                        var _xml = Lite.XML.XMLDom; 
                        _xml.async = async; 
                        if(cb){ 
                                _xml.onreadystatechange = function(){cb(_xml);} 
                        } 
                        _xml.load(url); 
                        if(!async) return _xml; 
                 }, 
                 pares:function(str){ 
                        var _xml = new DOMParser(); 
                        return _xml.parseFromString(str, "text/xml"); 
                 }, 
                 dump:function(xml){ 
                        return (new XMLSerializer()).serializeToString(xml); 
                 }, 
                 innerText:function(xml){ 
                        if(xml.nodeType == 9 )doc = xml.documentElement; 
                        else doc = xml; 
                        return doc.textContent; 
                 } 
         } 
 }else if (window.ActiveXObject){ 
         Lite.XML = { 
                  XMLDom:function(){ 
                        var ActiveX = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"]; 
                        var _xml = null; 
                        for (var i in ActiveX) { 
                                try {_xml = new ActiveXObject(ActiveX[i]);break;} 
                                catch (ex) {} 
                        } 
                        if(_xml) return _xml; 
                        else return false; 
                 }, 
                 load:function(url,async,cb){ 
                        var _xml = Lite.XML.XMLDom(); 
                        _xml.async = async; 
                        if(cb)_xml.onreadystatechange = function(){cb(_xml);} 
                        _xml.load(url); 
                 }, 
                 pares:function(str){ 
                        var _xml = Lite.XML.XMLDom(); 
                        if (_xml) { 
                                _xml.async = false; 
                                _xml.loadXML(txt); 
                                return _xml; 
                        } 
                 }, 
                 dump:function(xml){ 
                        return xml.xml; 
                 }, 
                 innerText:function(xml){ 
                        return xml.text; 
                 }
         }
}else{
         alert("Your Browser Do Not Support XML"); 
}
})(Lite);
 