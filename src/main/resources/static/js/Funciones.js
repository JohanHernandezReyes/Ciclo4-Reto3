
function validarvacio(campo, msj_vacio) {
    if (campo == "") {
        alert(msj_vacio);
        throw 'exit';
    }
}

function Verificarlogin(){

    try {
        var sesion = document.getElementById("welcome");
        console.log(sessionStorage.autosave);
        sessionStorage.setItem("autosave", sesion.innerHTML);

        if (sessionStorage.getItem("autosave")) {
            sesion.html(sessionStorage.getItem("autosave"));
        }

        sesion.addEventListener("change", function () {
            sessionStorage.setItem("autosave", sesion.innerHTML);
        });

        console.log(sessionStorage);
    }

    catch {

    }

    if (sessionStorage.autosave == null || sessionStorage.autosave == " ") {
        $(".aut").hide();
        $(".unaut").show();
        console.log("Usuario no autenticado");
    }
}


function cerrarsesion(){
    $("#welcome").html("");
    document.getElementById("ingreso").setAttribute("hidden", "true");
    Verificarlogin();
    document.getElementById("formlogin").removeAttribute("hidden");
    document.getElementById("btnlog").removeAttribute("hidden");
}

//Tabla Usuarios
function validarconfirm(password, confirm) {
    if (password != confirm) {
        alert("La confirmación no coincide con la contraseña ingresada");
        throw 'exit';
    }

    if($("#password").val().length < 8) {
        alert("La contraseña de tener minimo 8 caracteres");
        throw 'exit';
    }
}

function ValidarDuplicado(email, callbackFunction) {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            callbackFunction(email, respuesta);
        }
    });   
}    

function ListaUsuarios(email, respuesta){

    listusers=[];       
    for (i = 0; i < respuesta.length; i++) {
        listusers.push(respuesta[i].email);
    }
    console.log(listusers);
    u = email;
    console.log(u);
    if (listusers.includes(u) && u!=null) {
        alert("El email ya se encuentra registrado");
        throw exit;
    }else{
        NuevoUsuario();
    }
}


function NuevoUsuario() {
    validarvacio($("#name").val(), "Debe ingresar un nombre");
    validarvacio($("#email").val(), "Debe ingresar un e-mail");
    validarvacio($("#password").val(), "Debe ingresar una contraseña");
    validarvacio($("#confirm").val(), "Por favor confirme su contraseña");
    validarconfirm($("#password").val(), $("#confirm").val());
    document.getElementById("iduser").removeAttribute("hidden");
    let myData = {
        id: $("#iduser").val(),
        identification: $("#identif").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cel").val(),
        email: $("#email").val().toLowerCase(),
        password: $("#password").val(),
        zone: $("#zona").val(),
        type: $("#tipo").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/new",
        type: "POST",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#name").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirm").val("");
            $("#address").val("");
            $("#cel").val("");
            $("#zona").val("");
            $("#identif").val("");
            alert("se ha guardado el Usuario");
            document.getElementById("iduser").setAttribute("hidden", "true");
        }
    });
    
}

function guardarUsuario(){
    ValidarDuplicado($("#email").val().toLowerCase(), ListaUsuarios);
    ConsultarUsuarios();
}
     

function ValidarUsuario(email){
    let myData = email;
    validarvacio($("#uemail").val(), "Debe ingresar un e-mail");
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/emailexist/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            if (respuesta == false) {
                alert("Usuario no existe en la base de datos");
            } 
        }
    });
}



function Autenticacion(email, password) {
    ValidarUsuario(email);
    let myData = (email + "/" + password); console.log(myData);
    validarvacio($("#uemail").val(), "Debe ingresar un e-mail");
    validarvacio($("#upassword").val(), "Debe ingresar una contraseña valida");
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + email + "/" + password,
        type: "GET",
        data: email + "/" + password,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#uemail").val("");
            $("#upassword").val("");
            if (respuesta.name == null) {
                alert("Usuario o clave incorrectos");
            } else {
                document.getElementById("formlogin").setAttribute("hidden", "true");
                document.getElementById("btnlog").setAttribute("hidden", "true");
                document.getElementById("ingreso").removeAttribute("hidden");
                $("#welcome").html("Bienvenido "+respuesta.name+"<br>Ha ingresado con un rol de: "+respuesta.type);
                Verificarlogin();
            }

        }
    });
}


function nuevoid() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            listusers = [];
            for (i = 0; i < respuesta.length; i++) {
                listusers.push(respuesta[i].id);
            }
            if(respuesta.length=0){
                $("#iduser").val(1);
            }else{
                $("#iduser").val(Math.max.apply(null, listusers)+1);
            }
        }
    });
}    

function ConsultarUsuarios() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultUsers").empty();
            rta_users = respuesta;
            globalThis;
            console.log(respuesta);
            MostrarUsuarios(respuesta.items);
            document.getElementById("viewusers").setAttribute("hidden", "true");
            document.getElementById("titnew").setAttribute("hidden", "true");
            document.getElementById("formregistro").setAttribute("hidden", "true");
            document.getElementById("ResultUsers").removeAttribute("hidden");
            document.getElementById("newusers").removeAttribute("hidden");
        }
    });
}

function MostrarUsuarios() {
if(rta_users.length==0){
    var nodata=document.createTextNode("No existen datos en la tabla seleccionada");
    $("#ResultUsers").append(nodata);
}
else{     
    let myTable = "<table border:'2'>";
    let thead = "<thead>";
        thead += "<tr>";
        thead += "<th>" + "Id" + "</th>"
        thead += "<th>" + "Nombre" + "</th>"
        thead += "<th>" + "Identificación" + "</th>"
        thead += "<th>" + "Email" + "</th>"
        thead += "<th>" + "Dirección" + "</th>"
        thead += "<th>" + "Celular" + "</th>"
        thead += "<th>" + "Zona" + "</th>"
        thead += "<th>" + "Tipo_Usuario" + "</th>"
        thead += "<th>" + "Acciones" + "</th>"
        thead += "</tr>";
    thead += "<thead>";
    myTable += thead;
    for (i = 0; i < rta_users.length; i++) {
        myTable += "<tr>";
        myTable += "<td align=center>" + rta_users[i].id + "</td>";
        myTable += "<td align=center>" + rta_users[i].name + "</td>";
        myTable += "<td align=center>" + rta_users[i].identification + "</td>";
        myTable += "<td align=center>" + rta_users[i].email + "</td>";
        myTable += "<td align=center>" + rta_users[i].address + "</td>";
        myTable += "<td align=center>" + rta_users[i].cellPhone + "</td>";
        myTable += "<td align=center>" + rta_users[i].zone + "</td>";
        myTable += "<td align=center>" + rta_users[i].type + "</td>";
        myTable += "<td> <button onclick='ModificarUsuario(" + rta_users[i].id +")'>Actualizar</button>"+" "+
                    "<button onclick='BorrarUsuario("+rta_users[i].id+")'>Eliminar</button>";
        myTable += "</tr>";
    }
    myTable += "</table>";
    $("#ResultUsers").append(myTable);
}
}

function BorrarUsuario(idElemento){
    let myData = idElemento;
    $.ajax({
        url:"http://129.151.117.220:8003/api/user/"+myData,
        type:"DELETE",
        data:myData,
        contentType:"application/JSON",
        datatype:"JSON",
        success:function(respuesta){
            $("#ResultUsers").empty();
            ConsultarUsuarios();
            alert("Se ha Eliminado el usuario con id: " + idElemento);
            location.reload();
        }
        
    });
}

function MostrarFormNuevoUsuario(){
    $("#titnew").html("Crear Nuevo Usuario:");
    $("#BGUser").html("Guardar Usuario");
    document.getElementById("titnew").removeAttribute("hidden");
    document.getElementById("formregistro").removeAttribute("hidden");
    document.getElementById("viewusers").removeAttribute("hidden");
    $("#ResultUsers").empty();
    document.getElementById("newusers").setAttribute("hidden", "true");
}

function ModificarUsuario(idElement){
    MostrarFormNuevoUsuario();
    $("#titnew").html("Actualizar Datos del Usuario");
    $("#BGUser").html("Actualizar Datos");
    let bot = document.getElementById("BGUser");
    bot.removeAttribute("onclick");bot.setAttribute("onclick", "ActualizarUsuario()");
    let myData = idElement;
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            User1 = respuesta;
            console.log(User1);
            $("#iduser").val(User1.id);
            document.getElementById("iduser").removeAttribute("hidden");
            $("#identif").val(User1.identification);
            $("#email").val(User1.email);
            $("#name").val(User1.name);
            $("#password").val(User1.password);
            $("#confirm").val(User1.password);
            $("#address").val(User1.address);
            $("#cel").val(User1.cellPhone);
            $("#zona").val(User1.zone);
            $("#tipo").val(User1.type);
        }
    });

}

function ActualizarUsuario() {
    validarvacio($("#name").val(), "Debe ingresar un nombre");
    validarvacio($("#email").val(), "Debe ingresar un e-mail");
    validarvacio($("#password").val(), "Debe ingresar una contraseña");
    validarvacio($("#confirm").val(), "Por favor confirme su contraseña");
    validarconfirm($("#password").val(), $("#confirm").val());
    document.getElementById("iduser").removeAttribute("hidden");
    let myData = {
        id: parseInt($("#iduser").val()),
        identification: $("#identif").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cel").val(),
        email: $("#email").val().toLowerCase(),
        password: $("#password").val(),
        zone: $("#zona").val(),
        type: $("#tipo").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/user/update",
        type: "PUT",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#name").val("");
            $("#email").val("");
            $("#password").val("");
            $("#confirm").val("");
            $("#address").val("");
            $("#zona").val("");
            $("#cel").val("");
            $("#identif").val("");
            alert("se han actualizado los datos del Usuario");
            document.getElementById("iduser").setAttribute("hidden", "true");
            ConsultarUsuarios();
        }
    });
    let bot = document.getElementById("BGUser");
    bot.removeAttribute("onclick");bot.setAttribute("onclick", "guardarUsuario()");
    location.reload();
}

//Tabla Productos
function ValidarProdDuplicado(reference, callbackFunction) {
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            callbackFunction(reference, respuesta);
        }
    });   
}    

function ListaProductos(reference, respuesta){

    listproducts=[];       
    for (i = 0; i < respuesta.length; i++) {
        listproducts.push(respuesta[i].reference);
    }
    console.log(listproducts);
    p = reference;
    console.log(p);
    if (listproducts.includes(p) && p!=null) {
        alert("La referencia "+p+" ya se encuentra registrada");
        throw exit;
    }else{
        NuevoProducto();
    }
}


function NuevoProducto() {
    validarvacio($("#ref").val(), "Debe ingresar la referencia del producto");
    validarvacio($("#desc").val(), "Debe ingresar una descripcion");
    validarvacio($("#categ").val(), "Debe ingresar una categoria");
    validarvacio($("#price").val(), "Debe ingresar el precio de venta");
  
    let myData = {
        reference: $("#ref").val().toUpperCase(),
        brand: $("#brand").val(),
        category: $("#categ").val(),
        materiales: $("#materiales").val(),
        dimensiones: $("#dimensiones").val(),
        description: $("#desc").val().toLowerCase(),
        availability: $("#available").val(),
        price: $("#price").val(),
        quantity: $("#Q").val(),
        photography: $("#photography").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/new",
        type: "POST",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#ref").val("");
            $("#brand").val("");
            $("#categ").val("");
            $("#materiales").val("");
            $("#dimensiones").val("");
            $("#desc").val("");
            $("#price").val("");
            $("#Q").val("");
            $("#photography").val(""),
            alert("se ha guardado el Producto");
        }
    });
    
}

function guardarProducto(){
    ValidarDuplicado($("#ref").val().toUpperCase(), ListaProductos);
    ConsultarProductos();
}
     
function ConsultarProductos() {
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            $("#ResultProducts").empty();
            rta_products = respuesta;
            globalThis;
            console.log(respuesta);
            MostrarProductos(respuesta.items);
            document.getElementById("viewproducts").setAttribute("hidden", "true");
            document.getElementById("titnewp").setAttribute("hidden", "true");
            document.getElementById("formregistrop").setAttribute("hidden", "true");
            document.getElementById("ResultProducts").removeAttribute("hidden");
            document.getElementById("newproducts").removeAttribute("hidden");
        }
    });
}

function MostrarProductos() {
if(rta_products.length==0){
    var nodata=document.createTextNode("No existen datos en la tabla seleccionada");
    $("#ResultProducts").append(nodata);
}
else{     
    let myTable = "<table border:'2'>";
    let thead = "<thead>";
        thead += "<tr>";
        thead += "<th>" + "Ref" + "</th>"
        thead += "<th>" + "Descripcion" + "</th>"
        thead += "<th>" + "Brand" + "</th>"
        thead += "<th>" + "Categoría" + "</th>"
        thead += "<th>" + "Precio" + "</th>"
        thead += "<th>" + "Cantidad" + "</th>"
        thead += "<th>" + "Dimensiones" + "</th>"
        thead += "<th>" + "Disponible" + "</th>"
        thead += "<th>" + "Acciones" + "</th>"
        thead += "</tr>";
    thead += "<thead>";
    myTable += thead;
    for (i = 0; i < rta_products.length; i++) {
        myTable += "<tr>";
        myTable += "<td align=center>" + rta_products[i].reference + "</td>";
        myTable += "<td align=center>" + rta_products[i].description + "</td>";
        myTable += "<td align=center>" + rta_products[i].brand + "</td>";
        myTable += "<td align=center>" + rta_products[i].category + "</td>";
        myTable += "<td align=center>" + rta_products[i].price + "</td>";
        myTable += "<td align=center>" + rta_products[i].quantity + "</td>";
        myTable += "<td align=center>" + rta_products[i].dimensiones + "</td>";
        myTable += "<td align=center>" + rta_products[i].availability + "</td>";
        myTable += "<td> <button onclick='ModificarProducto(" + (i+1) +")'>Actualizar</button>"+" "+
                    "<button onclick='BorrarProducto("+ (i+1) +")'>Eliminar</button>";
        myTable += "</tr>";
    }
    myTable += "</table>";
    $("#ResultProducts").append(myTable);
}
}

function BorrarProducto(numrow){

    let fila = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[numrow].getElementsByTagName("td")[0];
    let myData= fila.firstChild.nodeValue;

    $.ajax({
        url:"http://129.151.117.220:8003/api/cookware/"+myData,
        type:"DELETE",
        data:myData,
        contentType:"application/JSON",
        datatype:"JSON",
        success:function(respuesta){
            $("#ResultProducts").empty();
            ConsultarProductos();
            alert("Se ha Eliminado el producto " + celda);
        }
        
    });
}

function MostrarFormNuevoProducto(){
    $("#titnewp").html("Crear Nuevo Producto:");
    $("#BGProduct").html("Guardar Producto");
    document.getElementById("titnewp").removeAttribute("hidden");
    document.getElementById("formregistrop").removeAttribute("hidden");
    document.getElementById("viewproducts").removeAttribute("hidden");
    $("#ResultProducts").empty();
    document.getElementById("newproducts").setAttribute("hidden", "true");
}

function ModificarProducto(numrow){

    let fila = document.getElementsByTagName("table")[0].getElementsByTagName("tr")[numrow].getElementsByTagName("td")[0];
    let myData= fila.firstChild.nodeValue;

    MostrarFormNuevoProducto();
    $("#titnewp").html("Actualizar Datos del Producto");
    $("#BGProduct").html("Actualizar Datos");
    let bot = document.getElementById("BGProduct");
    bot.removeAttribute("onclick");bot.setAttribute("onclick", "ActualizarProducto()");

    
    $.ajax({
        url: "http://129.151.117.220:8003/api/cookware/" + myData,
        type: "GET",
        data: myData,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            ref1 = respuesta;
            console.log(ref1);
            $("#ref").val(ref1.reference);
            $("#brand").val(ref1.brand);
            $("#categ").val(ref1.category);
            $("#desc").val(ref1.description);
            $("#materiales").val(ref1.materiales);
            $("#dimensiones").val(ref1.dimensiones);
            $("#Q").val(ref1.quantity);
            $("#price").val(ref1.price);
            $("#photography").val(ref1.photography);
            $("#available").val(String(ref1.availability));
        }
    });

}

function ActualizarProducto() {
    validarvacio($("#ref").val(), "Debe ingresar la referencia del producto");
    validarvacio($("#desc").val(), "Debe ingresar una descripcion");
    validarvacio($("#categ").val(), "Debe ingresar una categoria");
    validarvacio($("#price").val(), "Debe ingresar el precio de venta");

    let myData = {
        reference: $("#ref").val().toUpperCase(),
        brand: $("#brand").val(),
        category: $("#categ").val(),
        materiales: $("#materiales").val(),
        dimensiones: $("#dimensiones").val(),
        description: $("#desc").val().toLowerCase(),
        availability: $("#available").val(),
        price: $("#price").val(),
        quantity: $("#Q").val(),
        photography: $("#photography").val(),
    };
    let dataToSend = JSON.stringify(myData);
    console.log(dataToSend);
    $.ajax({
        url: "http://129.151.117.220:9003/api/cookware/update",
        type: "PUT",
        data: dataToSend,
        contentType: "application/JSON",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            $("#ref").val("");
            $("#brand").val("");
            $("#categ").val("");
            $("#materiales").val("");
            $("#dimensiones").val("");
            $("#desc").val("");
            $("#price").val("");
            $("#Q").val("");
            $("#photography").val(""),
            alert("se han actualizado los datos del Producto");
            ConsultarProductos();
        }
    });
    let bot = document.getElementById("BGProduct");
    bot.removeAttribute("onclick");bot.setAttribute("onclick", "guardarProducto()");
}
