STATUSES := planned ongoing completed resolution official certain dubious unknown

IM_CONVERT := convert
IM_REMOVE_DATE := +set date:create +set date:modify


ICONS := $(patsubst img/icons.src/%,%,$(wildcard img/icons.src/*.png))
DEST_ICONS := $(foreach STATUS,$(STATUSES),$(patsubst %,img/icons/$(STATUS)/%,$(ICONS)))

SIGNS := $(patsubst img/panneau/%,%,$(wildcard img/panneau/*.png))
DEST_SIGNS := $(patsubst %,img/panneau2/%,$(SIGNS))


all: icons signs

icons: $(DEST_ICONS)

signs: $(DEST_SIGNS)

test:
	@echo $(DEST_ICONS)
	@echo $(DEST_SIGNS)

.PHONY: all icons test mrclean


img/panneau2/%: img/panneau/% img/panneau2
	$(IM_CONVERT) $< -gravity center -background transparent -extent 256x256 \( +clone -channel A -morphology EdgeOut:5 Octagon +channel +level-colors black \) -compose DstOver -composite $(IM_REMOVE_DATE) $@

img/panneau2:
	mkdir --parent $@


img/icons/planned/%: img/icons.src/%
	$(IM_CONVERT) $< -colorspace Gray -channel A -evaluate multiply 0.5 +channel $(IM_REMOVE_DATE) $@

img/icons/ongoing/%: img/icons.src/%
	$(IM_CONVERT) $< $(IM_REMOVE_DATE) $@

img/icons/completed/%: img/icons.src/%
	$(IM_CONVERT) $< $(IM_REMOVE_DATE) $@

img/icons/resolution/%: img/icons.src/%
	$(IM_CONVERT) $< -channel A -evaluate multiply 0.6 +channel $(IM_REMOVE_DATE) $@

img/icons/official/%: img/icons.src/%
	$(IM_CONVERT) $< $(IM_REMOVE_DATE) $@

img/icons/certain/%: img/icons.src/%
	$(IM_CONVERT) $< $(IM_REMOVE_DATE) $@

img/icons/dubious/%: img/icons.src/%
	$(IM_CONVERT) $< -colorspace Gray $(IM_REMOVE_DATE) $@

img/icons/unknown/%: img/icons.src/%
	$(IM_CONVERT) $< $(IM_REMOVE_DATE) $@


$(DEST_ICONS): Makefile

$(DEST_SIGNS): Makefile

