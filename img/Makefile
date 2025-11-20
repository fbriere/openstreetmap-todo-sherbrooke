IM_CONVERT := convert
IM_REMOVE_DATE := +set date:create +set date:modify


SIGNS := $(patsubst icons.orig/panneaux-qc/%,%,$(wildcard icons.orig/panneaux-qc/*.png))
DEST_SIGNS := $(patsubst %,icons.thick/panneaux-qc/%,$(SIGNS))


all: signs

signs: $(DEST_SIGNS)

test:
	@echo $(DEST_SIGNS)

.PHONY: all signs test


icons.thick/panneaux-qc/%: icons.orig/panneaux-qc/%
	@mkdir --parents $(dir $@)
	$(IM_CONVERT) $< -gravity center -background transparent -extent 256x256 \( +clone -channel A -morphology EdgeOut:5 Octagon +channel +level-colors black \) -compose DstOver -composite $(IM_REMOVE_DATE) $@


$(DEST_SIGNS): Makefile

