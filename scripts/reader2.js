// $Id: reader2.js,v 1.1.2.39 2013-11-14 14:13:11 silenceandshadow Exp $
(function($) {
	$(document).ready(function() {

		PDFJS.workerSrc = Drupal.settings.reader.pdfWorkerSrc;

		//'use strict';

		/**
		 * pdfDocument definition
		 */
		function pdfDocument(readerPrefix, wrapper, pdfDoc) {
			this.readerPrefix = readerPrefix;
			this.wrapper = wrapper;
			this.pdfDoc = pdfDoc;
			this.baseScale = null;
			this.scale = null;
			this.page = new Array();
			this.index = 1;
			this.rendering = new Array();
			this.rendered = new Array();
			this.isFullscreen = false;
			for (var i = 1; i <= this.pdfDoc.numPages; i++) {
				this.addPage(i);
			}
		}

		pdfDocument.prototype.resetScale = function() {
			this.scale = null;
			this.baseScale = null;
		}

		pdfDocument.prototype.setScale = function(page, scale) {
			if (scale) {
				this.scale = scale;
			}
			else {
				var viewport = page.getViewport(1, 0),
					parent = this.wrapper.parent(),
					width = 1,
					height = 1,
					aspect = viewport.height / viewport.width;
				width = parent.innerWidth() - 30;
				height = parent.innerHeight() - 30;
				if (width > (height * aspect)) {
					this.baseScale = height / viewport.height;
				}
				else {
					this.baseScale = (width / (isMobile() ? 1 : 2)) / viewport.width;
				}
				this.scale = this.baseScale;
			}
		}

		pdfDocument.prototype.addCanvas = function(pageNum) {
			var canvas = $('<canvas />').attr('id', this.readerPrefix + '-canvas-' + pageNum).addClass('reader-canvas');
			this.page[pageNum].append(canvas);
		}

		pdfDocument.prototype.addPage = function(pageNum) {
			this.page[pageNum] = $('<div />').attr('id', this.readerPrefix + '-page-' + pageNum).addClass('reader-page');
			this.wrapper.append(this.page[pageNum]);
		}

		pdfDocument.prototype.renderComplete = function() {}

		pdfDocument.prototype.doRender = function(page) {
			this.rendering[page.pageNumber] = true;
			$('.reader-working').show();
			var self = this,
				viewport = null,
				canvas = this.page[page.pageNumber].children('.reader-canvas').get(0),
				ctx = null,
				renderCtx = null;
			if (!canvas) {
				this.addCanvas(page.pageNumber);
				canvas = this.page[page.pageNumber].children('.reader-canvas').get(0);
			}
			if (!this.scale) {
				this.setScale(page);
			}
			viewport = page.getViewport(this.scale, 0);
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			this.wrapper.width((canvas.width * (isMobile() ? 1 : 2)) + 'px');
			ctx = canvas.getContext('2d'),
			renderCtx = {
			  canvasContext: ctx,
			  viewport: viewport
			}
			page.render(renderCtx).then(function() {
				var renderComplete = true;
				self.rendering[page.pageNumber] = false;
				self.rendered[page.pageNumber] = true;
				for (var k in self.rendering) {
					if (self.rendering[k]) {
						renderComplete = false;
					}
				}
				if (renderComplete) {
					self.renderComplete();
				}
			});
		}

		pdfDocument.prototype.render = function(pageNum) {
			var self = this;
			if (pageNum) {
				this.pdfDoc.getPage(pageNum).then(function(page) {
					self.doRender(page);
				});
			}
			else {
				for (var i = 1; i <= this.pdfDoc.numPages; i++) {
					this.render(i);
				}
			}
		}

		pdfDocument.prototype.rerender = function(pageNum) {
			if (pageNum) {
				this.render(pageNum);
			}
			else {
				for (var i = 1; i <= this.pdfDoc.numPages; i++) {
					if (this.rendered[i]) {
						this.unrender(i);
						this.render(i);
					}
				}
			}
		}

		pdfDocument.prototype.unrender = function(pageNum) {
			if (pageNum) {
				this.page[pageNum].children('.reader-canvas').remove();
				this.rendered[pageNum] = false;
			}
			else {
				for(var i = 1; i <= this.pdfDoc.numPages; i++) {
					this.unrender(i);
				}
			}
		}

		pdfDocument.prototype.setPage = function(pageNum) {
			this.index = pageNum;
			var start = pageNum % 2 == 0 ? pageNum - 2 : pageNum - 3,
					end = pageNum % 2 == 0 ? pageNum * 1 + 3 : pageNum * 1 + 2;
			if (start < 1) {
				start = 1;
			}
			if (end > this.pdfDoc.numPages) {
				end = this.pdfDoc.numPages;
			}
			for (var i = start; i <= end; i++) {
				if (!this.rendered[i] && !this.rendering[i]) {
					this.render(i);
				}
			}
		}

		/**
		 * Detect mobile browser agent
		 */
		function isMobile() {
			 return ( navigator.userAgent.match(/Android/i)
			 || navigator.userAgent.match(/webOS/i)
			 || navigator.userAgent.match(/iPhone|iPad|iPod/i)
			 || navigator.userAgent.match(/BlackBerry/i)
			 || navigator.userAgent.match(/Windows Phone/i)
			 );
			}

		/**
		 * Do the stuff
		 */
		PDFJS.getDocument(Drupal.settings.reader.pdfFile).then(function(pdfDoc) {
			var readerPrefix = Drupal.settings.reader.prefix,
				canvasWrapper = '#' + readerPrefix + '-reader-canvas-wrapper',
				readerWrapper = '#' + readerPrefix + '-reader-container',
				flip = null,
				wrapperEl = $(readerWrapper).get(0),
				controlPanel = $('#' + readerPrefix + '-reader-control-panel'),
				fullScreen = $('<div />').attr('id', readerPrefix + '-reader-fullscreen'),
				rightSize = $('<div />').attr('id', readerPrefix + '-reader-rightsize'),
				zoomIn = $('<div />').attr('id', readerPrefix + '-reader-zoom-in'),
				zoomOut = $('<div />').attr('id', readerPrefix + '-reader-zoom-out'),
				next = $('<div />').attr('id', readerPrefix + '-reader-next'),
				prev = $('<div />').attr('id', readerPrefix + '-reader-prev'),
				canFullscreen = wrapperEl.requestFullscreen || wrapperEl.mozRequestFullScreen || wrapperEl.webkitRequestFullScreen,
				gestureStartX = new Array(),
			  gestureStartY = new Array(),
			  gestureEndX = new Array(),
			  gestureEndY = new Array(),
			  gesturing = false,
				pdfReader = new pdfDocument(readerPrefix, $(canvasWrapper), pdfDoc); // Create the pdfDocument object
			pdfReader.setPage(1);
			$('#reader-loading').show();
			$(canvasWrapper).hide();
			if (pdfReader.pdfDoc.numPages > 1) { // We only need a flipmag if there are pages to turn
				var displayNum = isMobile() ? 1 : 2;
				flip = new flipmag($(canvasWrapper), displayNum);
				flip.onPageTurn = function(pageNum) {
					pdfReader.setPage(flip.page[pageNum][0].attr('id').match(/\d+/)[0]);
				}
			}

			if (isMobile()) {
				controlPanel.addClass('reader-mobile');
			}

			controlPanel.addClass('reader-control-panel');
			fullScreen.addClass('reader-control-fullscreen').attr('title', 'View Full Screen');
			rightSize.addClass('reader-control-rightsize').attr('title', 'Size to Fit');
			zoomIn.addClass('reader-control-zoom-in').attr('title', 'Zoom In');
			zoomOut.addClass('reader-control-zoom-out').attr('title', 'Zoom Out');
			next.addClass('reader-control-next').attr('title', 'Next');
			prev.addClass('reader-control-prev').attr('title', 'Previous');

			controlPanel.append(rightSize.fadeIn()).append(zoomIn.fadeIn()).append(zoomOut.fadeIn()).append(prev.fadeIn()).append(next.fadeIn());

			if (canFullscreen && !isMobile()) {
				controlPanel.append(fullScreen.fadeIn());
			}

			function fullscreenHandler(e, pdfReader) {
				pdfReader.unrender();
				pdfReader.resetScale();
				$('#' + readerPrefix + '-reader-fullscreen').toggleClass('reader-control-isfullscreen');
				pdfReader.isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
				pdfReader.setPage(pdfReader.index);
			}

			$(document).bind('fullscreenchange', function(e) { fullscreenHandler(e, pdfReader); });
			$(document).bind('mozfullscreenchange', function(e) { fullscreenHandler(e, pdfReader); });
			$(document).bind('webkitfullscreenchange', function(e) { fullscreenHandler(e, pdfReader); });
			$(document).bind('msfullscreenchange', function(e) { fullscreenHandler(e, pdfReader); });

			rightSize.click(function(e) {
				pdfReader.scale = pdfReader.baseScale;
				pdfReader.unrender();
				pdfReader.setPage(pdfReader.index);
			});

			zoomIn.click(function(e) {
				pdfReader.scale += 0.25;
				pdfReader.unrender();
				pdfReader.setPage(pdfReader.index);
			});

			zoomOut.click(function(e) {
				pdfReader.scale -= 0.25;
				pdfReader.unrender();
				pdfReader.setPage(pdfReader.index);
			});

			prev.click(function(e) {
				flip.pageTurn('prev');
			});
			next.click(function(e) {
				flip.pageTurn('next');
			});

			$('#' + readerPrefix + '-reader-fullscreen').click(function(e) {
				if (pdfReader.isFullscreen) {
					fullScreen.attr('title', 'View Full Screen');
					if (document.exitFullscreen) {
						document.exitFullscreen();
					}
					else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					}
					else if (document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					}
				}
				else {
					fullScreen.attr('title', 'Exit Full Screen');
					if (wrapperEl.requestFullscreen) {
						wrapperEl.requestFullscreen();
					}
					else if (wrapperEl.mozRequestFullScreen) {
						wrapperEl.mozRequestFullScreen();
					}
					else if (wrapperEl.webkitRequestFullScreen) {
						wrapperEl.webkitRequestFullScreen();
					}
				}
			});

			$('#reader-loading').fadeOut();
			$(canvasWrapper).fadeIn();
		});
	});
})(jQuery);