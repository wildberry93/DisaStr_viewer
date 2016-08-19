/* Globals */

var aa = {'G': 'Gly','P': 'Pro','A': 'Ala','V': 'Val',
		'L': 'Leu','I': 'Ile','M': 'Met','C': 'Cys',
		'F': 'Phe','Y': 'Tyr','W': 'Trp','H': 'His',
		'K': 'Lys','R': 'Arg','Q': 'Gln','N': 'Asn',
		'E': 'Glu','D': 'Asp','S': 'Ser','T': 'Thr'};

var glviewer = null;
var labels = [];
var pdb_file = 'file:///C:/Users/jagoda/Desktop/disastr_repo/3fvq.pdb';
var dfn_file = 'file:///C:/Users/jagoda/Desktop/disastr_repo/rasmol.dfn';
var mappings_file = 'file:///C:/Users/jagoda/Desktop/disastr_repo/3fvqA.map';
var IsCalledOnce = true;
var muts = [2,5,10];
var variants = [3,20];
var filename = mappings_file.replace(/^.*[\\\/]/, '')

var global_chain = filename.split(".")[0][4];
console.log(global_chain);

var read_mappings = function(){
	map_dict = {};
	var mappings = readFile(mappings_file).split("\n");
	for (var i = 0; i < mappings.length; i++) {
		var splitted = mappings[i].split(/\s+/);
		muts = splitted[5].split(":").slice(1,splitted[5].split(":").length);
		map_dict[splitted[0]] = [splitted[1], splitted[4], muts];
	}

	return map_dict;
}

var apply_styles = function(viewer, mut_chain_id, muts_dict){
	var mappings = read_mappings();
	var chains_prot = [];
	var chains_nuc = [];
	var ligands_res = {};
	var metals_res = [];
	var muts_pos = [];

	var dfn_f = readFile(dfn_file);
	var splitted = dfn_f.split("\n");  

	for (var i = 0; i < splitted.length; i++) {
		if (splitted[i][0] === "P"){
			if (splitted[i][1] != mut_chain_id)	{
				chains_prot.push(splitted[i][1]);
			}

		} else if (splitted[i][0] === "N"){
			chains_nuc.push(splitted[i][1]);
		} else if (splitted[i][0] === "l"){
			resid = splitted[i].split(" ")[2].split("(")[0] // need for regexp :-(
			chain = splitted[i].split(" ")[2].split("(")[1][0]
			ligands_res[resid] = chain;
		} else if (splitted[i][0] === "M"){
			metals_res.push(splitted[i].slice(1, splitted.length).split(" ")[0]);
		}
	}

	glviewer.setStyle({chain:mut_chain_id}, {cartoon:{color:'#A020F0'}}); // sel chain
	glviewer.setStyle({chain:chains_prot}, {cartoon:{color:'#D3D3D3'}});  // remaining chains
	glviewer.setStyle({chain:chains_nuc}, {stick:{}}); // nucleic acid

	for (key in ligands_res) {
		glviewer.setStyle({chain:ligands_res[key], resi:key}, {sphere:{}}); // ligands
	}

	for (key in muts_dict) {	
		muts_pos.push(muts_dict[key][1]);
	}

	glviewer.setStyle({chain: mut_chain_id, resi: muts_pos}, 
			{stick: {color: 'red'}, cartoon: {color: '#A020F0'}}); // muts resis

	for (var i = 0; i < metals_res.length; i++) {
		glviewer.setStyle({resn:" "+metals_res[i]}, {sphere: {color: "blue"}} ); // muts resis
	}

	//glviewer.addResLabels({chain: mut_chain_id, resi: muts_pos, atom: 'CA'}, 
	//		{fontSize: 13, showBackground: false, fontColor: 'black'}); //muts resis labels resn

}

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

var readText = function(input) {
	console.log(input);
	if(input.files.length > 0) {
		var file = input.files[0];
		var reader = new FileReader();
	    //reader.onload = function(evt) {
	    //	func(evt.target.result,file.name);
	    //};
	    reader.readAsText(file);
	    //$(input).val('');
	    console.log(evt.target.result);
	}
};

function readFile(file) {
    var http = new XMLHttpRequest();
    http.open('get', file, false);
    http.send();
    var text = http.responseText;

    return text;
}

function make_muts_list(muts_dict, chain) {

	var element = $("#selediv");
	for (key in muts_dict) {
		resi_num = muts_dict[key][1]
		for (var i = 0; i < muts_dict[key][2].length; i++) {

			mut = aa[muts_dict[key][0][0]]+" "+key+" "+aa[muts_dict[key][2][i][0]];
			var col = "black";
			if (muts_dict[key][2][i][1] === 'd') {
				col = "red";
			}

			string = '<ul onclick="zoom_residue(this,'+resi_num+
						',glviewer);"><font color='+col+'>'+mut+'</font></ul>';
			element.append(string);
		}
	}
}

function zoom_residue(element, position, glelement) {  
	glviewer.zoomTo({chain:global_chain, resi: position});
	glelement.render();
}  

$(document).ready(function() {

	// this should be changed later
	file = readFile(pdb_file);
	var muts_dict = read_mappings();

	glviewer = $3Dmol.createViewer("gldiv");
	glviewer.addModel(file, "pqr");

	apply_styles(glviewer, global_chain, muts_dict);
    
    glviewer.render();
    make_muts_list(muts_dict, global_chain);

	glviewer.mapAtomProperties($3Dmol.applyPartialCharges);
	glviewer.setBackgroundColor(0xffffff);

});
