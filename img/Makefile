IM_CONVERT := convert
IM_REMOVE_DATE := +set date:create +set date:modify


SIGNS := $(patsubst panneau/%,%,$(wildcard panneau/*.png))
DEST_SIGNS := $(patsubst %,panneau2/%,$(SIGNS))


all: signs

signs: $(DEST_SIGNS)

test:
	@echo $(DEST_SIGNS)

.PHONY: all signs test


panneau2/%: panneau/% panneau2
	$(IM_CONVERT) $< -gravity center -background transparent -extent 256x256 \( +clone -channel A -morphology EdgeOut:5 Octagon +channel +level-colors black \) -compose DstOver -composite $(IM_REMOVE_DATE) $@

panneau2:
	mkdir --parent $@


$(DEST_SIGNS): Makefile

