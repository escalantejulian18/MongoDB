var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function mapa() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: {lat: 40.7588362, lng: -73.9884532},
    mapTypeId: 'roadmap'
  });
  return map;
}

function catA() {

    var map = mapa();
    getJSON('http://localhost:3000/query', function(error,cities){
      for (var i = 0; i < cities.length; i++) {
        for (var j = 0; j < cities[i].grades.length; j++) {

            if ((cities[i].grades[j].date) >= ("2014-01-01T00:00:00.000Z") && (cities[i].grades[j].date) < ("2015-01-01T00:00:00.000Z")) {

                if ((cities[i].grades[j].score) < (10)){
                  var info = cities[i].name;
                  var pos = {lat: cities[i].address.coord[1], lng: cities[i].address.coord[0]};
                  var citMark = markG (map, pos, info);
                }

                  else if ((cities[i].grades[j].score) > (20)){
                    var info = cities[i].name;
                    var pos = {lat: cities[i].address.coord[1], lng: cities[i].address.coord[0]};
                    var citMark = markY (map, pos, info);
                  }

                    else if ((cities[i].grades[j].score) >= (10) && ((cities[i].grades[j].score) <= (20))){
                      var info = cities[i].name;
                      var pos = {lat: cities[i].address.coord[1], lng: cities[i].address.coord[0]};
                      var citMark = markR (map, pos, info);
                    }
            }
        }
      }
  });

  function markY (map, pos, info){
    var marker = new google.maps.Marker({
      icon:'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      position: pos,
      map: map,
      title: info
    });
  }

  function markG (map, pos, info){
    var marker = new google.maps.Marker({
      icon:'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      position: pos,
      map: map,
      title: info
    });
  }

  function markR (map, pos, info){
    var marker = new google.maps.Marker({
      icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      position: pos,
      map: map,
      title: info
    });
  }
}


function catC() {
    var map = mapa();
    getJSON('http://localhost:3000/query', function(error,cities){
      for (var i = 0; i < cities.length; i++) {
        for (var j = 0; j < cities[i].grades.length; j++) {

          if (((cities[i].borough) == ("Manhattan")) && ((cities[i].grades[j].grade) == ("C"))) {
            var info = cities[i].name;
            var pos = {lat: cities[i].address.coord[1], lng: cities[i].address.coord[0]};
            var citMark = markB (map, pos, info);
            console.log(pos);
          }

        }
      }
  });

  function markB (map, pos, info){
    var marker = new google.maps.Marker({
      icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      position: pos,
      map: map,
      title: info
    });
  }
}

function menus() {

  var search = document.getElementById('search').value
  console.log(search);
  var map = mapa();
  getJSON('http://localhost:3000/query', function(error,cities){
    for (var i = 0; i < cities.length; i++) {
      for (var j = 0; j < cities[i].grades.length; j++) {

        if (((cities[i].cuisine) == (search)) && ((cities[i].grades[j].grade) == ("B"))) {
          var info = cities[i].name;
          var pos = {lat: cities[i].address.coord[1], lng: cities[i].address.coord[0]};
          var citMark = markO (map, pos, info);
          console.log(pos);
        }

      }
    }
});

  function markO (map, pos, info){
    var marker = new google.maps.Marker({
      icon:'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      position: pos,
      map: map,
      title: info
    });
  }
}
