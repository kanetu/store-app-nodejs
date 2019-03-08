$(window).on('resize load',function(){
	if($('body').width() < 576){
		$('#footer-one').addClass('collapse');
		$('#footer-two').addClass('collapse');
		$('#footer-three').addClass('collapse');
		$('#footer-four').addClass('collapse');
	}else{
		$('#footer-one').removeClass('collapse');
		$('#footer-two').removeClass('collapse');
		$('#footer-three').removeClass('collapse');
		$('#footer-four').removeClass('collapse');
	}

});

$('#datepicker').datepicker({
        uiLibrary: 'bootstrap4'
    });

$('#owl-example').owlCarousel({
	items: 4,
	margin: 10,
	autoWidth:true,
	responsive: {
		600: {
			items: 4
		}
	}
});
function turnDropdown(btn){
	var btnId =	$(btn).attr('id');
	var parentId = $(btn).parent().attr('id');

	if($(btn).hasClass('active-dropdown')){
		$(btn).removeClass('active-dropdown');
		$('#'+ parentId +' .group-item').each(function(){
			$(this).addClass('hide-dropdown');
			$(this).removeClass('show-dropdown');
		});
		$('#'+ parentId +' .arrow').css('transform','rotateZ(0deg)');
	}else{
		$(btn).addClass('active-dropdown');
		$('#'+ parentId +' .group-item').each(function(){
			$(this).addClass('show-dropdown');
			$(this).removeClass('hide-dropdown');
		})
		$('#'+ parentId +' .arrow').css("transform","rotateZ(540deg)");

	}
}
