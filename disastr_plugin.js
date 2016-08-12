var glviewer = null;
var labels = [];
var pdb_id = "1a5j";
var list = ["Arg20Ser", "His30Thr", "Met111His", "Ala2002Lys"];


var addLabels = function() {
	var atoms = glviewer.getModel().selectedAtoms({
		atom : "CA"
	});
	for ( var a in atoms) {
		var atom = atoms[a];

		var l = glviewer.addLabel(atom.resn + " " + atom.resi, {
			inFront : true,
			fontSize : 12,
			position : {
				x : atom.x,
				y : atom.y,
				z : atom.z
			}
		});
		atom.label = l;
		labels.push(atom);
	}
};

var colorSS = function(viewer) {
	//color by secondary structure
	var m = viewer.getModel();
	m.setColorByFunction({}, function(atom) {
		if(atom.ss == 'h') return "magenta";
		else if(atom.ss == 's') return "orange";
		else return "white";
	});
	viewer.render();
}

var atomcallback = function(atom, viewer) {
	if (atom.clickLabel === undefined || !atom.clickLabel instanceof $3Dmol.Label) {
		atom.clickLabel = viewer.addLabel(atom.elem + atom.serial, {
		fontSize : 14,
		position : {
			x : atom.x,
			y : atom.y,
			z : atom.z
		},
		backgroundColor: "black"
	});
	atom.clicked = true;
	}

	//toggle label style
	else {

		if (atom.clicked) {
			var newstyle = atom.clickLabel.getStyle();
			newstyle.backgroundColor = 0x66ccff;

			viewer.setLabelStyle(atom.clickLabel, newstyle);
			atom.clicked = !atom.clicked;
		}
		else {
			viewer.removeLabel(atom.clickLabel);
			delete atom.clickLabel;
			atom.clicked = false;
		}

	}
};
var readText = function(input,func) {
	if(input.files.length > 0) {
		var file = input.files[0];
		var reader = new FileReader();
	    reader.onload = function(evt) {
	    	func(evt.target.result,file.name);
	    };
	    reader.readAsText(file);
	    $(input).val('');
	}
};

var muts = [2,5,10]
var variants = [3,20]

function make_muts_list(element, mut, glelement) {
	//var myRe = new RegExp("([A-Za-z]{3})([0-9]+)([A-Za-z]{3}|\?)", "g");
	//var myArray = myRe.exec("Ala20His"); // get residue number 
	resi_num = 20
	//string = '<li onclick="switchColors(this,'+resi_num+','+glelement+');">'+mut+'</li>';
	string = '<li onclick="switchColors(this,'+20+',glviewer);">'+mut+'</li>';
	element.append(string);
}

function switchColors(element, position, glelement) {  

	//links=document.getElementsByTagName("li"); 
	glelement.setStyle({resi: position}, {stick: {color: 'blue'}});
	glviewer.zoomTo({resi: position});
	glelement.render();

	/*for (var i = 0 ; i < links.length ; i ++)  
	links.item(i).style.color = 'black';  
	element.style.color='orange'; */
}  


$(document).ready(function() {

	glviewer = $3Dmol.createViewer("gldiv");

	for (var i = 0; i < list.length; i++) {
    	make_muts_list( $("#selediv"), list[i], glviewer);
	}


    $3Dmol.download('pdb:'+pdb_id, glviewer, {}, function() {
    	glviewer.setStyle({}, {cartoon:{}}); 
    	glviewer.setStyle({resi: muts}, {cartoon: {color: 'green'}}); // muts resis
    	glviewer.setStyle({resi: variants}, {cartoon: {color: 'red'}}); // variants resis
    	glviewer.render();
    });




	glviewer.setBackgroundColor(0xffffff);

});
