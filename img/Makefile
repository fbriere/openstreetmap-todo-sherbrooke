IM_CONVERT := convert
IM_REMOVE_DATE := +set date:create +set date:modify

SIGNS_SRC_DIR := icons.orig
SIGNS_DEST_DIR := icons.thick


SIGNS_SRC := $(wildcard $(SIGNS_SRC_DIR)/*.png $(SIGNS_SRC_DIR)/*/*.png)
SIGNS_DEST := $(patsubst $(SIGNS_SRC_DIR)/%,$(SIGNS_DEST_DIR)/%,$(SIGNS_SRC))


all: signs

signs: $(SIGNS_DEST)

test:
	@echo $(SIGNS_DEST)

.PHONY: all signs test


icons.thick/%: icons.orig/%
	@mkdir --parents $(dir $@)
	$(IM_CONVERT) $< -gravity center -background transparent -extent 256x256 \( +clone -channel A -morphology EdgeOut:5 Octagon +channel +level-colors black \) -compose DstOver -composite $(IM_REMOVE_DATE) $@


$(SIGNS_DEST): Makefile

