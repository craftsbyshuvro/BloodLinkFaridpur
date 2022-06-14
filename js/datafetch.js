var API_URL = "https://opensheet.elk.sh/1OikUKYdFw41d98Lja2ueqPNqrnWaJULnplb4UnO8ZZw/1"
var FILTER_DATA_URL = "https://opensheet.elk.sh/1mahdAussK7HV103sqG-fQl-Jqpd7XxsVr1_fbdpDmDI/1"
var PIN = ""

userList = null;
all_user_list = null;

filter_date_url = null;


fetch(FILTER_DATA_URL)
  .then((res) => res.json())
  .then((result) => {
    
    PIN = result[0]['PIN'];

    filter_date_url = result;
    districts_html = "";
    districts_html+= "<option selected value=''>--Select--</option>";

    upazilas_html = "";
    upazilas_html+= "<option selected value=''>--Select--</option>";


    $.each(result, function(index, value) {
      district = "<option value="+value['বর্তমান জেলা - Current District']+">"+value['বর্তমান জেলা - Current District']+"</option>";
      districts_html+=district;

      
      upazila = "<option value="+value['বর্তমান উপজেলা - Current Upazila']+">"+value['বর্তমান উপজেলা - Current Upazila']+"</option>";
      upazilas_html+=upazila;
  });

  $("#district").html(districts_html);
  $("#upazila").html(upazilas_html);

});


fetch(API_URL)
  .then((res) => res.json())
  .then((result) => {
    userList = result;
    all_user_list = result;
    updateTable(userList);
  });


function filterCount(data, criteria, value) {
  const count = data.filter(obj => {
      if (obj[criteria] == value) {
          return true;
      }

      return false;
  }).length;

  return count;
}





function updateTable(userList) {
  a_positive_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'A+')
  a_negative_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'A-')

  b_positive_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'B+')
  b_negative_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'B-')

  ab_positive_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'AB+')
  ab_negative_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'AB-')

  o_positive_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'O+')
  o_negative_count = filterCount(userList, 'রক্তের গ্রুপ - Blood Group', 'O-')

  $("#a_positive_count").text(a_positive_count);
  $("#a_negative_count").text(a_negative_count);
  $("#b_positive_count").text(b_positive_count);
  $("#b_negative_count").text(b_negative_count);
  $("#ab_positive_count").text(ab_positive_count);
  $("#ab_negative_count").text(ab_negative_count);
  $("#o_positive_count").text(o_positive_count);
  $("#o_negative_count").text(o_negative_count);

  total_male = filterCount(userList, 'লিঙ্গ - Gender', 'পুরুষ (Male)')
  total_female = filterCount(userList, 'লিঙ্গ - Gender', 'মহিলা (Female)')
  $("#total_male").text(total_male);
  $("#total_female").text(total_female);

  var serial = 1;

  $("#total_donor").text(userList.length);
  var donor_list = "";
  $.each(userList, function(index, value) {

      var donor = "<tr>"
      
      var name = value['নাম (ইংরেজিতে) - Name in English'];
      var blood_group = value['রক্তের গ্রুপ - Blood Group'];
      var district = value['বর্তমান জেলা - Current District'];
      var upazila = value['বর্তমান উপজেলা - Current Upazila'];

      donor += "<td>" + serial + "</td>";
      donor += "<td>" + name + "</td>";
      donor += "<td>" + blood_group + "</td>";
      donor += "<td>" + district + "</td>";
      donor += "<td>" + upazila + "</td>";
      donor += "<td><button type='button' onclick='setModalDetails(" + serial + ")' class='btn btn-primary' data-toggle='modal' data-target='#myModal'>Details</button></td>";
      donor += "</tr>";

      donor_list += donor;
      serial += 1;
  });

  $("#donor_list").html(donor_list);

  $("body > div > div:nth-child(3) > div").empty();

  $("#example").simplePagination({
    previousButtonClass: "btn btn-primary",
    nextButtonClass: "btn btn-primary",
  });
    
}


function setModalDetails(serial) {

  $("#person_details").hide();
  $("#pin_field").val(null);

  var user = userList[serial - 1];

  $("#modal_header").text(user['নাম (ইংরেজিতে) - Name in English']);
  $("#donor_name").text(user['নাম (ইংরেজিতে) - Name in English']);
  $("#donor_blood_group").text(user['রক্তের গ্রুপ - Blood Group']);
  $("#donor_dob").text(user['জন্ম তারিখ (dd/mm/yyyy)- Date of Birth । অবশ্যই এই ফরম্যাটে ইংরেজিতে লিখতে হবে। যেমন ২৫ জুন ১৯৮৮ হলে, লিখতে হবে 25/06/1988']);
  $("#donor_gender").text(user['লিঙ্গ - Gender']);
  $("#donor_division").text(user['বর্তমান বিভাগ - Current Division']);
  $("#donor_district").text(user['বর্তমান জেলা - Current District']);
  $("#donor_upazila").text(user['বর্তমান উপজেলা - Current Upazila']);
  $("#donor_address").text(user['বর্তমান ঠিকানা - Current Address']);
  $("#donor_phone").text(user['ফোন নাম্বার - Phone Number']);

}

function validatePIN() {
  var pin = $("#pin_field").val();

  console.log(PIN);

  if (pin == PIN) {
      $("#person_details").show();
      $("#pin_verifyMessage").text("Correct PIN!");
  } else {
      $("#person_details").hide();
      $("#pin_verifyMessage").text("Incorrect PIN!");
  }
}


function searchDonor() {

  var name = $("#name").val();
  var district = $("#district option:selected").val();
  var bg = $("#bg option:selected").val();
  var upazila = $("#upazila option:selected").val();

  userList = all_user_list.filter(function(el) {
      return ((el['বর্তমান জেলা - Current District'] == district) || (district == undefined || district.length == 0))
      && ((String(el['নাম (ইংরেজিতে) - Name in English']).toLowerCase().includes(name.toLowerCase())) || (name == undefined || name.length == 0))
      && (el['বর্তমান উপজেলা - Current Upazila'] == upazila || (upazila == undefined || upazila.length == 0))
      && (el['রক্তের গ্রুপ - Blood Group']== bg || (bg == undefined || bg.length == 0))
  });

  updateTable(userList);
}

function resetSearch(){

  $("#name").val(null);
  $("#district option:selected").val(null);
  $("#bg option:selected").val(null);
  $("#upazila option:selected").val(null);

  updateTable(all_user_list);
}