$(function(){
    $(".print").click(function(){
        window.print();
        return false;
    });

    var inputcsv = $("#inputcsv");

    var model = {
        page : ko.observableArray(),
        logo: ko.observable("logo.png"),
        color: ko.observable('#000000'),
    };

    ko.applyBindings(model);

    function parseData() {
        var data = CSVToArray(inputcsv.val().replace(/^\s+/, '').replace(/\s+$/,'').replace(/\n+\n/g,'\n'), "\t");
        $("#status").text("Cantidad: " + data.length);

        model.page.removeAll();
        $.each(data, function(i, e){
            if (i % 2 == 0) {
                model.page.push({ person : ko.observableArray() });
            }

            var pages = ko.utils.unwrapObservable(model.page)
            pages[pages.length - 1].person.push({
                number: e[0],
                name: e[1]
            });
        });
    };

    $("input[type=file]").change(function(){
      var file = this.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        model.logo(reader.result);
      }
      if (file) {
        reader.readAsDataURL(file);
      }
    });

    $('#color')
      .colorPicker({
        renderCallback: function($elm, toggled) {
          if (toggled === false) {
            model.color($elm.css("background-color"));
          }
        }
      });

    inputcsv.change(parseData);
    inputcsv.keydown(function(e) {
      var $this, end, start;
      if (e.keyCode === 9) {
        start = this.selectionStart;
        end = this.selectionEnd;
        $this = $(this);
        $this.val($this.val().substring(0, start) + "\t" + $this.val().substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
        return false;
      }
    });
    inputcsv.keyup(parseData);

    inputcsv.val("1\tJose Pelufo\r\n2\tSandra Lin\r\n3\tJimmy Doe\r\n4\tDude\r\n5\tCarl Finn\r\n6\tLaura Tren\r\n");
    parseData();
});



// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    if (strData.length == 0) return [];

    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
