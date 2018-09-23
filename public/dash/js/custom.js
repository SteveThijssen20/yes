$("#submit").click(function(){
	// alert("asdf");
	if( $('#username').val() == '' || $('#firstname').val() == '' || $('#lastname').val() == '' || $('#email').val() == '' || $('#phone').val() == ''){
		alert('Please fill data field');
		return false;
	}
	var username = $('#username').val();
	var firstname = $('#firstname').val();
	var lastname = $('#lastname').val();
	var email = $('#email').val();
	var gender = $('#gender').val();
	var phone = $('#phone').val();

	$('#submit').prop('disabled', true);
	$.ajax({
		type: "POST",
		url: "http://18.130.255.217:3000/api/cms/data_input",
		// The key needs to match your method's input parameter (case-sensitive).
		data: { 
			"username": username,
			"firstname": firstname,
			"lastname": lastname,
			"email": email,
			"gender": gender,
			"phone": phone
		},
		dataType: "JSON",
		success: function(data){
			$('#submit').prop('disabled', false);
			alert("success");
		},
		failure: function(errMsg) {
			alert(errMsg);
		}
	});

	$('#submit').prop('disabled', true);
	$.ajax({
		type: "POST",
		url: "http://18.130.255.217:3000/api/cms/data_input_eos",
		// The key needs to match your method's input parameter (case-sensitive).
		data: { 
			"username": username,
			"firstname": firstname,
			"lastname": lastname,
			"email": email,
			"gender": gender,
			"phone": phone
		},
		dataType: "JSON",
		success: function(data){
			$('#submit').prop('disabled', false);
			var transaction = data.transaction;
			$('#transaction_expiration').html("expiration : ").append(JSON.stringify(transaction.transaction.expiration));
			$('#transaction_ref_block_num').html("ref_block_num : ").append(JSON.stringify(transaction.transaction.ref_block_num));
			$('#transaction_ref_block_prefix').html("ref_block_prefix : ").append(JSON.stringify(transaction.transaction.ref_block_prefix));
			$('#transaction_data').html("data : ").append(JSON.stringify(transaction.transaction.actions[0].data));
			$('#transaction_signatures').html("signatures : ").append(JSON.stringify(transaction.signatures));
			console.log(transaction);
		},
		failure: function(errMsg) {
			alert(errMsg);
		}
	});

	return false;
});

$("#data_output").click(function(){

	// $('#data_output').prop('disabled', true);
	$("#data_output").css("pointer-events", "none");

	$.ajax({
		type: "POST",
		url: "http://18.130.255.217:3000/api/cms/data_output",
		// The key needs to match your method's input parameter (case-sensitive).
		dataType: "JSON",
		success: function(data){
			// var rows = [{"firstName":"John", "last Name":"Doe", "age":"46"},
			// {"firstName":"James", "last Name":"Blanc", "age":"24"},
			// {"firstName":"James", "last Name":"Blanc", "age":"24"}];
			var html = "<table style='width:1000'";
			html += '<tr>';
			for( var j in data[0] ) {
			html += '<th>' + j + '</th>';
			}
			html += '</tr>';
			for( var i = 0; i < data.length; i++) {
			html += '<tr>';
			for( var j in data[i] ) {
				html += '<td>' + data[i][j] + '</td>';
			}
			}
			html += '</table>';
			document.getElementById('container').innerHTML = html;
			// $('#submit').prop('disabled', false);
			$("#data_output").css("pointer-events", "auto");
		},
		failure: function(errMsg) {
			alert(errMsg);
		}
	});
	return false;
});