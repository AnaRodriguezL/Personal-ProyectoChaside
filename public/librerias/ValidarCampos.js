function PrimeraLetraMayusculaTexto(texto) {
		texto=texto.toLowerCase();
		var caracteres =  texto.split(' ');
		for (var i = 0; i <= caracteres.length - 1; i++) {
		  	caracteres[i] = caracteres[i].charAt(0).toUpperCase() + caracteres[i].slice(1);
		}
		return caracteres.join(" ");
}

function PrimeraLetraMayusculaPalabra(texto) {
    texto=texto.toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function textoMayuscula(texto) {
    texto=texto.toUpperCase();
    return texto;
}

function ValidarSoloNumeros(id) {
    $(id).ValidarCampos('1234567890');
}

function ValidarMoneda(id) {
    $(id).ValidarCampos('1234567890.,$');
}

function ValidarPorcentaje(id) {
    $(id).ValidarCampos('1234567890.,%');
}

function ValidarDecimales(id) {
    $(id).ValidarCampos('1234567890.');
}

function ValidarNumerosNegativosPositivos(id) {
    $(id).ValidarCampos('-1234567890');
}

function ValidarLetrasEspacio(id) {
    $(id).ValidarCampos('abcdefghijklmnñopqrstuvwxyzáéíóúü ');
}

function ValidarSoloLetras(id) {
    $(id).ValidarCampos('abcdefghijklmnñopqrstuvwxyzáéíóúü');
}

function ValidarTipoTexto(id) {
    $(id).ValidarCampos('abcdefghijklmnñopqrstuvwxyzáéíóúü1234567890 -.,;:%()');
}

function ValidarTipoCorreo(id) {
    $(id).ValidarCampos('abcdefghijklmnopqrstuvwxyz1234567890-_&#.@');
}

function ValidarDireccion(id) {
    $(id).ValidarCampos('abcdefghijklmnñopqrstuvwxyzáéíóúü1234567890 #-.,°');
}

function ValidarLetrasNumerosEspacio(id) {
    $(id).ValidarCampos("abcdefghijklmñnopqrstuvwxyzáéíóúü1234567890 ");
}

function ValidarNombreEmpresas(id) {
		$(id).ValidarCampos("abcdefghijklmñnopqrstuvwxyzáéíóúü1234567890 .-,&;:");
}

function ValidarLetrasNumeros(id) {
    $(id).ValidarCampos("abcdefghijklmnopqrstuvwxyz1234567890");
}

function ValidarTipoDatoIdentificadorDocumento(id) {
    $(id).ValidarCampos("abcdefghijklmnopqrstuvwxyzáéíóúü1234567890 -");
}

function ValidarSiglas(id) {
    $(id).ValidarCampos("abcdefghijklmnopqrstuvwxyzáéíóúü1234567890 .-;,");
}

function ValidarLetrasNumerosGuion(id) {
    $(id).ValidarCampos("abcdefghijklmnopqrstuvwxyz1234567890-");
}

(function (a) {
    a.fn.ValidarCampos = function (b) {
        a(this).on({
            keypress: function (a) {
                var c = a.which,
                    d = a.keyCode,
                    e = String.fromCharCode(c).toLowerCase(),
                    f = b;
                (-1 != f.indexOf(e) || 9 == d || 37 != c && 37 == d || 39 == d && 39 != c || 8 == d || 46 == d && 46 != c) && 161 != c || a.preventDefault()
            }
        });
        a(this).on({
            change: function (a) {
                var texto = "";
                if(this.value !=undefined){
                    for (var i = 0; i < this.value.length; i++) {
                        if (b.indexOf(this.value.toLowerCase().charAt(i), 0) != -1) {
                            texto = texto + this.value.charAt(i);
                        }
                    }
                }
                this.value = $.trim(texto);
            }
        });
    }
})(jQuery);
