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