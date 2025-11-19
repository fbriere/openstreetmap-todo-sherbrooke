IM_CONVERT := convert
IM_REMOVE_DATE := +set date:create +set date:modify


SIGNS := $(patsubst img/panneau/%,%,$(wildcard img/panneau/*.png))
DEST_SIGNS := $(patsubst %,img/panneau2/%,$(SIGNS))


all: signs

signs: $(DEST_SIGNS)

test:
	@echo $(DEST_SIGNS)

.PHONY: all test mrclean


img/panneau2/%: img/panneau/% img/panneau2
	$(IM_CONVERT) $< -gravity center -background transparent -extent 256x256 \( +clone -channel A -morphology EdgeOut:5 Octagon +channel +level-colors black \) -compose DstOver -composite $(IM_REMOVE_DATE) $@

img/panneau2:
	mkdir --parent $@


$(DEST_SIGNS): Makefile

