latex: documentation/zn.pdf

documentation/zn.pdf: documentation/zn.tex
	cd documentation && pdflatex zn.tex

clean:
	-rm documentation/*.aux documentation/*.log documentation/*.pdf
