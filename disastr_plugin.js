/* Globals */

var glviewer = null;
var labels = [];
var pdb_id = "1a5j";
var list = ["Arg20Ser", "His30Thr", "Met111His", "Ala70Lys"];
var list2 = [1,2,3,4,5,6]
var IsCalledOnce = true;
var muts = [2,5,10];
var variants = [3,20];


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
	if(IsCalledOnce) {
		m.setColorByFunction({}, function(atom) {
			if(atom.ss == 'h') return "magenta";
			else if(atom.ss == 's') return "orange";
			else return "#d3d3d3";
		});
		viewer.render();
		IsCalledOnce = false;
	} else {
		m.setColorByFunction({}, function(atom) {
			if(atom.ss == 'h') return "#d3d3d3";
			else if(atom.ss == 's') return "#d3d3d3";
			else return "#d3d3d3";
		});
		viewer.render();
		IsCalledOnce = true;
	}

	}
	
/* Because we color residues by mutation type we need to 
   keep the coloring when switching between representations */

var set_custom_stick = function(viewer) {
	viewer.setStyle({},{stick:{}}); 
	viewer.setStyle({resi: muts}, {stick: {color: 'green'}}); // muts resis
    viewer.setStyle({resi: variants}, {stick: {color: 'red'}}); // variants resis

    viewer.render();
}
var set_custom_cartoon = function(viewer) {
	viewer.setStyle({},{cartoon:{}}); 
	viewer.setStyle({resi: muts}, {cartoon: {color: 'green'}}); // muts resis
    viewer.setStyle({resi: variants}, {cartoon: {color: 'red'}}); // variants resis

    viewer.render();
}

var set_custom_representation = function(viewer) {
	viewer.setStyle({},{stick:{}}); 
	viewer.setStyle({resi: muts}, {stick: {color: 'green'}}); // muts resis
    viewer.setStyle({resi: variants}, {stick: {color: 'red'}}); // variants resis

    viewer.render();
}

var set_custom_line = function(viewer) {
	viewer.setStyle({},{line:{}}); 
	viewer.setStyle({resi: muts}, {line: {color: 'green'}}); // muts resis
    viewer.setStyle({resi: variants}, {line: {color: 'red'}}); // variants resis

    viewer.render();
}

var set_custom_sphere = function(viewer) {
	viewer.setStyle({},{sphere:{}}); 
	viewer.setStyle({resi: muts}, {sphere: {color: 'green'}}); // muts resis
    viewer.setStyle({resi: variants}, {sphere: {color: 'red'}}); // variants resis

    viewer.render();
}

var atomcallback = function(atom, viewer) {
	console.log(atom.resn);
	if (atom.clickLabel === undefined || !atom.clickLabel instanceof $3Dmol.Label) {

		viewer.addResLabels({resi: atom.resi, atom: 'CA'});
		atom.clicked = true; 
		/*atom.clickLabel = viewer.addLabel(atom.resn + " " + atom.resi,{
		fontSize : 14,
		position : {
			x : atom.x,
			y : atom.y,
			z : atom.z
		},
		backgroundColor: "black"
	});
	atom.clicked = true; */
	}

	//toggle label style
	/*else {
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

	} */
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


function make_muts_list(element, mut, glelement) {
	var myRe = new RegExp("([A-Za-z]{3})([0-9]+)([A-Za-z]{3}|\\?)", "g");
	var myArray = myRe.exec(mut); // get residue number 
	console.log(myArray);
	resi_num = myArray[2];
	string = '<ul onclick="switchColors(this,'+resi_num+',glviewer);">'+mut+'</ul>';
	element.append(string);
}

function switchColors(element, position, glelement) {  

	//glelement.setStyle({resi: position}, {stick: {color: 'blue'}});
	glviewer.zoomTo({resi: position});
	glelement.render();

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
    	var m = glviewer.getModel();
    	var atoms = m.selectedAtoms({});

    	console.log(atoms);

    	for (var i in atoms) {
			var atom = atoms[i];
			atom.clickable = true;
			atom.callback = atomcallback;
		}

    });

	glviewer.setBackgroundColor(0xffffff);


});
